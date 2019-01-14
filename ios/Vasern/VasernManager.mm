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

RCT_EXPORT_METHOD(InsertRecords: (NSString *)collection
                  data:(NSArray *)data
                insertWithResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    
    auto coll = fsm.select([collection UTF8String]);
    
    if (coll != nullptr) {
        
        size_t total = 0;
        coll->open_writer();
        
        NSDictionary *rObj;
        NSString* stType;
        vs::upair_t r_pairs;
        
        for (rObj in data) {

            vs_utils_ios::obj_to_upair(stType, &r_pairs, rObj);
            
            coll->insert(&r_pairs);
            r_pairs.clear();
            total++;
        }

        coll->close_writer();
        
        
        resolve(@{
            @"status": @"ok",
            @"changes": @{
                @"inserted": @(total),
                @"unchanged": @0,
                @"removed": @0,
                @"updated": @0
            }
        });
        
    } else {
        reject(@"no_collection", [NSString stringWithFormat:@"Collection `%@` does not exist!", collection], NULL);
    }
}

RCT_EXPORT_METHOD(GetRecordsByQuery: (NSString*)collection
                  data:(NSDictionary *)data
                  getWithResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    
    NSMutableArray* items = [NSMutableArray new];
    std::string value;
    vs::upair_t query;
    std::shared_ptr<vs::collect_t> collect = fsm.select([collection UTF8String]);
    
    if (collect == nullptr) {
         reject(@"no_collection", [NSString stringWithFormat:@"Collection `%@` does not exist!", collection], NULL);
    } else {
    
        NSMutableDictionary* queries = [data objectForKey:@"$filter"];
        
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
        
        query = vs_utils_ios::to_query(collect, queries);
        
        collect->open_reader();
        
        // Check if $sort is enabled
        // Then extract $sort properties
        
        bool sortable = false;
        bool desc = false;
        const char* order_by;
        if (data[@"$sort"] != nil) {
            sortable = true;
            // Currently support only the last property
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
        
        if (rs.size() == 0) {
            collect->close_reader();
        } else {
            
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
            NSDictionary* relateObj;
            NSString* tempStr;
            if ([data valueForKey:@"$include"] != nil) {
                
                NSDictionary* includeObjects = [data valueForKey:@"$include"];
                vs::upair_t pQuery;
                std::shared_ptr<vs::collect_t> pCollect;
                bool multiple = false;
                
                // tasks, ...
                for (id itr: includeObjects) {
                    relateObj = [includeObjects objectForKey:itr];
                    
                    pCollect = fsm.select([relateObj[@"relate"] UTF8String]);
                    pCollect->open_reader();
                    // items
                    for (id item : items) {
                        
                        if (relateObj[@"filter"] != nil) {
                            pQuery = vs_utils_ios::to_query(pCollect, relateObj[@"filter"]);
                        }
                        
                        if (relateObj[@"idMatchField"] != nil) {
                            
                            // relate
                            pQuery[[relateObj[@"idMatchField"] UTF8String]] = vs::value_f::create([[item valueForKey:@"id"] UTF8String]);
                            multiple = true;
                            
                        } else if(relateObj[@"refField"] != nil)  {
                            
                            tempStr = [NSString stringWithFormat:@"%s", [relateObj[@"refField"] UTF8String] ];
                            pQuery["id"] = vs::value_f::create([[item valueForKey:tempStr] UTF8String]);
                            multiple = false;
                        }
                        
                        auto found = pCollect->filter(&pQuery);
                        
                        if (found.size() > 0) {
                            if (multiple) {
                                [item
                                 setValue:vs_utils_ios::to_nsarray(found)
                                 forKey:itr];
                            } else {
                                [item
                                 setValue:vs_utils_ios::to_nsarray({ found[0] })[0]
                                 forKey:itr];
                            }
                        }
                    };
                    pCollect->close_reader();
                    pQuery.clear();
                }
            }
        }
        
        resolve(@{
            @"items": items,
            @"status": @"ok",
            @"changes": @{
                    @"updated": @0,
                    @"unchanged": @0,
                    @"removed": @0,
                    @"inserted": @0
            }});
    }
}

/*
 * Count number of records that match with query (through key and indexes)
 * Using `CountRecordsByQuery` will be must faster than using `GetRecordsByQuery` to count
 * as it doesn't load records
 */
RCT_EXPORT_METHOD(CountRecordsByQuery: (NSString*)collection
                  data:(NSDictionary*)queryData
                  getWithResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    
    std::shared_ptr<vs::collect_t> collect = fsm.select([collection UTF8String]);
    if (collect == nullptr) {
        reject(@"no_collection", [NSString stringWithFormat:@"Collection `%@` does not exist!", collection], NULL);
    } else {
        
        vs::upair_t query = vs_utils_ios::to_query(collect, queryData);
        
        resolve(@{
            @"total": @(collect->count(&query)),
            @"status": @"ok",
            @"changes": @{
                    @"updated": @0,
                    @"unchanged": @0,
                    @"removed": @0,
                    @"inserted": @0
            }});
    }
}

/*
 * Remove records by keys
 * TODO: Design errors (i.e for invalid inputs, keys)
 */
RCT_EXPORT_METHOD(DeleteRecords: (NSString*)collection
                  data:(NSArray*)keys
                  getWithResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    std::shared_ptr<vs::collect_t> collect = fsm.select([collection UTF8String]);
    
    if (collect == nullptr) {
        reject(@"no_collection", [NSString stringWithFormat:@"Collection `%@` does not exist!", collection], NULL);
    } else {
        
        size_t total = [keys count];
        collect->remove_keys(vs_utils_ios::to_vector<const char*>(keys));
        resolve(@{
            @"status": @"ok",
            @"changes": @{
                @"removed": @(total),
                @"unchanged": @0,
                @"inserted": @0,
                @"updated": @0
            }
        });
    }
}

/*
 * Comparing user defined database model (JS side) with current database model (loaded from meta table)
 * => If models are match, do nothing
 * => If database has not initiated yet, setup database and save model to meta table
 * TODO: Migration when models (JS side vs Native side) are mismatch.
 */
RCT_EXPORT_METHOD(Startup: (NSDictionary*)modelObject
                  getWithResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    if (fsm.verify_collections((int)[modelObject count]) == false) {
        std::unordered_map<std::string, vs::layout_t> model = vs_utils_ios::to_database_model(modelObject);
        fsm.setup(model);
    };
    
    resolve(@{ @"status": @"ok",
               @"changes": @{
                       @"updated": @0,
                       @"unchanged": @0,
                       @"removed": @0,
                       @"inserted": @0
            }});
}

/*
 * !!! Use with caution
 * Permanantly remove all records within a collection
 */
RCT_EXPORT_METHOD(RemoveAllRecords: (NSString*)collection
                  getWithResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    std::shared_ptr<vs::collect_t> collect = fsm.select([collection UTF8String]);
    
    if (collect == nullptr) {
        reject(@"no_collection", [NSString stringWithFormat:@"Collection `%@` does not exist!", collection], NULL);
    } else {
        
        collect->remove_all_records();
        resolve(@{ @"status": @"ok",
                   @"changes": @{
                           @"updated": @0,
                           @"unchanged": @0,
                           @"removed": @0,
                           @"inserted": @0
                }});
    }
}

/*
 * !!! Use with caution
 * Permanantly remove all records of all collections
 */
RCT_EXPORT_METHOD(ClearAllCollections:
                  getWithResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    fsm.clear_all_collections();
    
    // TODO: Return number of collections
    resolve(@{ @"status": @"ok",
               @"changes": @{
                   @"removed": @0,
                   @"inserted": @0,
                   @"updated": @0,
                   @"unchanged": @0
            }});
}

RCT_EXPORT_METHOD(UpdateRecords: (NSString*)collection
                  data:(NSDictionary*)data
                  getWithResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    std::shared_ptr<vs::collect_t> collect = fsm.select([collection UTF8String]);
    
    if (collect == nullptr) {
        reject(@"no_collection", [NSString stringWithFormat:@"Collection `%@` does not exist!", collection], NULL);
    } else {
        
        size_t total = [data count];
        
        collect->open_writer_update();
        vs::upair_t pairs;
        NSString* buff;
        for (id _id in data) {
            vs_utils_ios::obj_to_upair(buff, &pairs, [data objectForKey:_id]);
            collect->update(vs::value_f::create([_id UTF8String]), &pairs);
            pairs.clear();
        }
        collect->close_writer();
        
        resolve(@{
            @"status": @"ok",
            @"changes": @{
                @"updated": @(total),
                @"unchanged": @0,
                @"removed": @0,
                @"inserted": @0
            }
        });
    }
}

RCT_EXPORT_METHOD(AllRecords: (NSString*)collection
                  getWithResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    std::shared_ptr<vs::collect_t> collect = fsm.select([collection UTF8String]);
    
    if (collect == nullptr) {
        reject(@"no_collection", [NSString stringWithFormat:@"Collection `%@` does not exist!", collection], NULL);
    } else {
        NSMutableArray* items = [NSMutableArray new];
        collect->open_reader();
        
        vs::block_reader* item = collect->first();
        
        while(item->is_valid()) {
            if (!item->is_tombstone()) {
                [items addObject:vs_utils_ios::upair_to_obj(item->object())];
            }
            item->next();
        }
        
        collect->close_reader();
        
        resolve(@{
            @"status": @"ok",
            @"items": items,
            @"changes": @{
                    @"updated": @0,
                    @"unchanged": @0,
                    @"removed": @0,
                    @"inserted": @0
            }
        });
    }
}

@end

