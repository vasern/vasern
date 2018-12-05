//================================================================
//
//  Copyright by Ambi Studio 2018
//  Licensed under the Apache License, Version 2.0 (the "License");
//  (Please find "LICENSE" file attached for license details)
//================================================================

#import <Foundation/Foundation.h>
#import <unordered_map>

#import "VasernManager.h"
#import "utils/utils.h"
#import "fsms/fsm.h"
#import "fsms/index_set/queries/value_f.h"

const char* dir = vs_utils_ios::create_dir("fsm");
vs::fsm fsm(dir);

@implementation VasernManager

- (dispatch_queue_t)methodQueue
{
    return dispatch_queue_create("ios.ambistudio.VasernQueue", DISPATCH_QUEUE_SERIAL);
}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(Insert: (NSString *)collection
                  data:(NSArray *)data
                insertWithResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    
    auto coll = fsm.select([collection UTF8String]);
    coll->open_writer();
    
    std::string buff;
    std::vector<vs::col_t*> indexes;
    NSDictionary *indexObjs;

    
    const char* ikey;
    id indexValue;
    vs::col_t* col;
    vs::upair_t i_pairs;
    
    // TODO: replace row_desc_t "indexes" with "pairs"
    
    for (id it in data) {
        
        indexObjs = [it objectForKey:@"indexes"];
        i_pairs = vs::upair_t();
        
        for (auto const& iitem : coll->desc.indexes) {
            ikey = iitem->name.c_str();
            indexValue = [indexObjs valueForKey:[NSString stringWithUTF8String:ikey]];
            col = vs::desc_t::create_col(iitem->type, ikey, iitem->size());
            
            switch (iitem->type) {
                case vs::STRING:
                case vs::KEY:
                    col->set([indexValue UTF8String]);
                    i_pairs[ikey] = vs::value_f::create([indexValue UTF8String]);
                    break;
                    
                case vs::INT_N:
                    col->set([indexValue intValue]);
                    i_pairs[ikey] = vs::value_f::create([indexValue intValue]);
                    break;
                    
                case vs::BOOLEAN:
                    col->set([indexValue boolValue]);
                    i_pairs[ikey] = vs::value_f::create([indexValue boolValue]);
                    break;
                    
                case vs::DOUBLE_N:
                    col->set([indexValue doubleValue]);
                    i_pairs[ikey] = vs::value_f::create([indexValue doubleValue]);
                    break;
                    
                case vs::LONG_N:
                    col->set([indexValue longValue]);
                    i_pairs[ikey] = vs::value_f::create([indexValue longValue]);
                    break;
            };
            
            indexes.push_back(col);
        }
        
        vs::row_desc_t row = {
            vs::col_key_t("id", [it[@"id"] UTF8String]),
            vs::col_str_t("body", [it[@"body"] UTF8String]),
            indexes,
            i_pairs
        };
        coll->insert(&buff, row);
        
        indexes.clear();
    }
    
    coll->close_writer();
    resolve(@{ @"status": @200 });
}

RCT_EXPORT_METHOD(Query: (NSString*)collect_name
                  data:(NSDictionary *)data
                  getWithResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    
    NSMutableArray* items = [NSMutableArray new];
    std::string value;
    vs::upair_t query;
    std::shared_ptr<vs::collect_t> collect;
    
    NSMutableDictionary* queries = [data mutableCopy];
    [queries removeObjectsForKeys:@[@"$prefetch", @"$include", @"$limit", @"$paging"]];
    
    // Process `$prefetch` and `$include`
    
    if ([data valueForKey:@"$prefetch"] != nil) {
        
        
        NSDictionary* pValues = [data objectForKey:@"$prefetch"];
        
        // Prefetch
        vs::upair_t pQuery;
        std::shared_ptr<vs::collect_t> pCollect;
        NSArray* qValues;
        for (id ref in pValues) {
            
            qValues = [[pValues objectForKey:ref] allKeys];

            // Collection level
            id obj = [qValues objectAtIndex:0];

            pCollect = fsm.select([obj UTF8String]);
            
            // Properties level
            pQuery = vs_utils_ios::to_query(pCollect, [[pValues objectForKey:ref] objectForKey:obj]);
            
            // Filter and get id
            [queries setValue:@{ @"equal" : @(pCollect->get_id(&pQuery)) }
                       forKey:ref];
        }
    }
    
    collect = fsm.select([collect_name UTF8String]);
    query = vs_utils_ios::to_query(collect, queries);
    
    collect->open_reader();
    
    if (data[@"$limit"] != nil) {
        [items addObjectsFromArray:vs_utils_ios::to_nsarray(collect->filter(&query),
                                                            &collect->desc,
                                                            0,
                                                            [data[@"$limit"] longValue])];
    } else if (data[@"$paging"] != nil) {
        int max = [data[@"$paging"][@"max"] intValue];
        int start = [data[@"$paging"][@"page"] intValue] * max;
        [items addObjectsFromArray:vs_utils_ios::to_nsarray(collect->filter(&query),
                                                            &collect->desc,
                                                            start,
                                                            start + max)];
    } else {
        [items addObjectsFromArray:vs_utils_ios::to_nsarray(collect->filter(&query), &collect->desc)];
    }

    collect->close_reader();
    
    if ([data valueForKey:@"$include"] != nil) {
        auto deep = [data valueForKey:@"$include"];
        vs::upair_t pQuery;
        std::shared_ptr<vs::collect_t> pCollect;
        
        // tasks, ...
        for (id itr: deep) {
            pQuery.clear();
            pCollect = fsm.select([[deep objectForKey:itr][@"relate"] UTF8String]);
            pCollect->open_reader();
            // items
            for (id item : items) {
                
                if ([[deep objectForKey:itr] valueForKey:@"filter"] != nil) {
                    pQuery = vs_utils_ios::to_query(pCollect, [[deep objectForKey:itr] objectForKey:@"filter"]);
                }
                
                if ([deep objectForKey:itr][@"idMatchField"] != nil) {
                    
                    // relate
                    pQuery[[[deep objectForKey:itr][@"idMatchField"] UTF8String]] = vs::value_f::create([[item valueForKey:@"id"] UTF8String]);
                    
                } else if([deep objectForKey:itr][@"refField"] != nil)  {
                    
                    auto key = [NSString stringWithFormat:@"%s", [[deep objectForKey:itr][@"refField"] UTF8String] ];
                    pQuery["id"] = vs::value_f::create([[item valueForKey:key] UTF8String]);
                    
                }
                
                auto found = pCollect->filter(&pQuery);
                
                if (found.size() > 0) {
                    [item
                     setValue:vs_utils_ios::to_nsarray(found, &pCollect->desc)[0]
                     forKey:itr];
                }
                
                
            };
            pCollect->close_reader();
        }
    }
    
    resolve(@{ @"data": items });
}

RCT_EXPORT_METHOD(Count: (NSString*)collect_name
                  data:(NSDictionary *)data
                  getWithResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    
    std::shared_ptr<vs::collect_t> collect = fsm.select([collect_name UTF8String]);
    vs::upair_t query = vs_utils_ios::to_query(collect, data);
    
    collect->open_reader();
    
    NSNumber *result = @(collect->count(&query));
    
    collect->close_reader();
    
    
    resolve(@{
      @"data": @{ @"count": result },
      @"status": @200
    });
}

RCT_EXPORT_METHOD(Delete:  (NSString*)collect_name
                  data:(NSArray*)data
                  getWithResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    std::shared_ptr<vs::collect_t> collect = fsm.select([collect_name UTF8String]);
    std::vector<const char*> ids = vs_utils_ios::to_vector<const char*>(data);
    
//    collect->open_writer();
    collect->remove(ids);
//    collect->close_writer();
    
    resolve(@{ @"status": @200 });
}

RCT_EXPORT_METHOD(Startup: (NSDictionary*)models
                  getWithResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    if (fsm.verify_collections([models count]) == false) {
        std::unordered_map<std::string, vs::desc_t> desc;
        
        NSDictionary *obj, *indexObjs, *indexItemObj;
        std::vector<vs::col_t*> indexes;
        
        size_t col_size;
        const char* col_type;
        vs::col_key_t* key;
        vs::col_str_t* body;
        
        for (id itr : models) {
            indexes.clear();
            obj = [models objectForKey:itr];
            
            // Extract key
            key = new vs::col_key_t("id", "key");
            
            // Extract body
            body = new vs::col_str_t("body", "");
            
            // Extract indexes
            indexObjs = [obj objectForKey:@"indexes"];
            for (id iitr : indexObjs) {
                
                indexItemObj = [indexObjs objectForKey:iitr];
                
                col_size = 0;
                col_type = [indexItemObj[@"type"] UTF8String];
                
                if ([indexItemObj objectForKey:@"size"]) {
                    col_size = [indexItemObj[@"size"] longValue];
                }
                
                indexes.push_back(vs::desc_t::create_col(col_type, [iitr UTF8String], col_size));
            }
            
            desc.insert({
                [itr UTF8String],
                vs::desc_t(*key, *body, indexes, [obj[@"version"] intValue] )
            });
        }
        
        fsm.setup(desc);
    }
}
@end

