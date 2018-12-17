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
#import "src/fsm.h"
#import "src/values/value_f.h"

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
    
    if (coll != nullptr) {
        
        coll->open_writer();
        
        NSDictionary *rObj;
        NSString* stType;
        vs::upair_t r_pairs;
        
        for (rObj in data) {

            vs_utils_ios::obj_to_upair(stType, &r_pairs, rObj);
            
            coll->insert(&r_pairs);
            r_pairs.clear();
        }

        coll->close_writer();
        
        resolve(@{ @"status": @200 });
        
    } else {
        reject(@"no_collection", [NSString stringWithFormat:@"Unable to find collection name %@", collection], NULL);
    }
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
    [queries removeObjectsForKeys:@[@"$prefetch", @"$include", @"$limit", @"$paging", @"$sort"]];
    
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
    
    // Check if $sort is enabled
    // Then extract $sort properties
    
    bool sortable = false;
    bool desc = false;
    const char* order_by;
    if (data[@"$sort"] != nil) {
        sortable = true;
        for (id itr in data[@"$sort"]) {
            order_by = [itr UTF8String];
            desc = [data[@"$sort"][itr] boolValue];
        }
    }
    
    // Apply sort and query
    
    std::vector<vs::block_reader*> rs;
    
    if (sortable) {
        rs = collect->filter(&query, order_by, desc);
    } else {
        rs = collect->filter(&query);
    }
    
    // Query properties
    // $sort, $paging, $limit
    
    if (data[@"$limit"] != nil) {
        
        // Apply $limit
        
        [items addObjectsFromArray:vs_utils_ios::to_nsarray(rs, 0, [data[@"$limit"] longValue])];
        
    } else if (data[@"$paging"] != nil) {
        
        // Apply $paging
        
        int max = [data[@"$paging"][@"max"] intValue];
        int start = [data[@"$paging"][@"page"] intValue] * max;
        [items addObjectsFromArray:vs_utils_ios::to_nsarray(rs, start, start + max)];
        
    } else {
        
        [items addObjectsFromArray:vs_utils_ios::to_nsarray(rs)];
    }

    collect->close_reader();
    
    if ([data valueForKey:@"$include"] != nil) {
        id deep = [data valueForKey:@"$include"];
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
                     setValue:vs_utils_ios::to_nsarray(found)[0]
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

RCT_EXPORT_METHOD(Delete: (NSString*)collect_name
                  data:(NSArray*)data
                  getWithResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    
    fsm.select([collect_name UTF8String])
        ->remove(vs_utils_ios::to_vector<const char*>(data));
    
    resolve(@{ @"status": @200 });
}

RCT_EXPORT_METHOD(Startup: (NSDictionary*)models
                  getWithResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    if (fsm.verify_collections([models count]) == false) {
        
        std::unordered_map<std::string, vs::layout_t> tables;
        NSDictionary *obj, *indexObjs;
        vs::type_desc_t type;
        
        for (id itr in models) {
            
            vs::schema_t schema;
            obj = [models objectForKey:itr];
            
            for (id col_itr in obj) {
                indexObjs = [obj objectForKey:col_itr];
                type = static_cast<vs::type_desc_t>([indexObjs[@"type"] intValue]);
                
                if (type == vs::STRING) {
                    schema.push_back(vs::col_t([col_itr UTF8String], type, [indexObjs[@"size"] intValue]));
                } else {
                    schema.push_back(vs::col_t([col_itr UTF8String], type));
                }
            }
            
            tables[[itr UTF8String]] = vs::layout_t(schema, 1024);
        }
        
        fsm.setup(tables);
    }
}
@end

