//================================================================
//
//  Copyright by Ambi Studio 2018
//  Licensed under the Apache License, Version 2.0 (the "License");
//  (Please find "LICENSE" file attached for license details)
//================================================================

#import <Foundation/Foundation.h>

#import "VasernManager.h"
#import "utils/utils.h"
#import <unordered_map>
#import "fsms/fsm.h"

const char* dir = vs_utils_ios::create_dir("fsm");
vs::fsm fsm(dir);

@implementation VasernManager
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
    for (id it in data) {
        
        indexObjs = [it objectForKey:@"indexes"];
        
        for (auto const& iitem : coll->desc.indexes) {
            ikey = iitem->name.c_str();
            indexValue = [indexObjs valueForKey:[NSString stringWithUTF8String:ikey]];
            col = vs::desc_t::create_col(iitem->type, ikey, iitem->size());
            
            switch (iitem->type) {
                case vs::STRING:
                case vs::KEY:
                    col->set([indexValue UTF8String]);
                    break;
                    
                case vs::INT_N:
                    col->set([indexValue intValue]);
                    break;
                    
                case vs::BOOLEAN:
                    col->set([indexValue boolValue]);
                    break;
                    
                case vs::DOUBLE_N:
                    col->set([indexValue doubleValue]);
                    break;
                    
                case vs::LONG_N:
                    col->set([indexValue longValue]);
                    break;
            };
            
            indexes.push_back(col);
        }
        
        vs::row_desc_t row = {
            vs::col_key_t("id", [it[@"id"] UTF8String]),
            vs::col_str_t("body", [it[@"body"] UTF8String]),
            indexes
        };
        coll->insert(&buff, row);
        
        indexes.clear();
    }
    
    coll->close_writer();
    resolve(@{ @"status": @200 });
}

RCT_EXPORT_METHOD(Query: (NSDictionary *) data
                  getWithResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    
    NSMutableArray* items = [NSMutableArray new];
    std::string value;
    vs::upair_t query;
    std::shared_ptr<vs::collect_t> collect;
    for (id collect_name in data) {
        
        collect = fsm.select([collect_name UTF8String]);
        query = vs_utils_ios::to_query(collect, [data objectForKey:[NSString stringWithUTF8String:[collect_name UTF8String]]]);
        
        collect->open_reader();
        
        [items addObjectsFromArray:vs_utils_ios::to_nsarray(collect->filter(&query), &collect->desc)];

        collect->close_reader();
    }
    
    resolve(@{ @"data": items });
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

