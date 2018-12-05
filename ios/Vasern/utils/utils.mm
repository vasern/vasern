//================================================================
//
//  Copyright by Ambi Studio 2018
//  Licensed under the Apache License, Version 2.0 (the "License");
//  (Please find "LICENSE" file attached for license details)
//================================================================


#include "utils.h"
#include "../fsms/index_set/queries/value_f.h"

namespace vs_utils_ios {
    
    void assign_objc_native_value(vs::prop_desc_t type, NSMutableDictionary* obj, vs::record_t* r, const char* name) {
        
        switch (type) {
            case vs::STRING:
                obj[@(name)] = @(r->str_value(name).c_str());
                break;
                
            case vs::INT_N:
                obj[@(name)] = @(r->int_value(name));
                break;
                
            case vs::LONG_N:
                obj[@(name)] = @(r->long_value(name));
                break;
                
            case vs::DOUBLE_N:
                obj[@(name)] = @(r->double_value(name));
                break;
                
            case vs::BOOLEAN:
                obj[@(name)] = @(r->bool_value(name));
                break;
                
            default:
                break;
        }
    }
    
    NSArray* to_nsarray(std::vector<vs::record_t*> records, vs::desc_t* desc) {
        NSMutableArray* rs = [NSMutableArray arrayWithCapacity:records.size()];
        
        int i = 0;
        NSMutableDictionary* obj;
        for (auto r: records) {
            obj = [NSMutableDictionary new];
            [obj setValue:[NSString stringWithUTF8String:r->key().c_str()] forKey:@"id"];
            [obj setValue:[NSString stringWithUTF8String:r->value().c_str()] forKey:@"body"];
            
            for (auto itr : desc->indexes) {
                assign_objc_native_value(itr->type, obj, r, itr->name.c_str());
            }
            
            [rs insertObject:obj atIndex:i];
            i++;
        }
        
        return rs;
    }
    
    NSArray* to_nsarray(std::vector<vs::record_t*> records, vs::desc_t* desc, long start, long end) {
        NSMutableArray* rs = [NSMutableArray arrayWithCapacity:end - start];
        
        int i = start, rsi = 0;
        size_t r_size = records.size();
        if (end > r_size) { end = r_size; };
        
        NSMutableDictionary* obj;
        vs::record_t* r;
        while (i < end) {
            r = records.at(i);
            obj = [NSMutableDictionary new];
            [obj setValue:[NSString stringWithUTF8String:r->key().c_str()] forKey:@"id"];
            [obj setValue:[NSString stringWithUTF8String:r->value().c_str()] forKey:@"body"];
            
            for (auto itr : desc->indexes) {
                assign_objc_native_value(itr->type, obj, r, itr->name.c_str());
            }
            
            [rs insertObject:obj atIndex:rsi++];
            i++;
        }
        
        return rs;
    }
    
    vs::value_t* get_value(vs::prop_desc_t type, NSDictionary* pair, NSString* key) {
        
        switch (type) {
            case vs::STRING:
            case vs::KEY:
                return vs::value_f::create([[pair valueForKey:key] UTF8String]);
            case vs::INT_N:
                if ([pair count] == 2) {
                    return vs::value_f::create([[pair valueForKey:@"start"] intValue], [[pair valueForKey:@"end"] intValue]);
                }
                return vs::value_f::create([[pair valueForKey:key] intValue]);
            case vs::LONG_N:
                if ([pair count] == 2) {
                    return vs::value_f::create([[pair valueForKey:@"start"] longValue], [[pair valueForKey:@"end"] longValue]);
                }
                return vs::value_f::create([[pair valueForKey:key] longValue]);
            case vs::DOUBLE_N:
                if ([pair count] == 2) {
                    return vs::value_f::create([[pair valueForKey:@"start"] doubleValue], [[pair valueForKey:@"end"] doubleValue]);
                }
                return vs::value_f::create([[pair valueForKey:key] doubleValue]);
            case vs::BOOLEAN:
                return vs::value_f::create([[pair valueForKey:key] boolValue]);
        }
        
        return new vs::value_t;
    }
    
    vs::upair_t to_query(std::shared_ptr<vs::collect_t> coll, NSDictionary* obj) {
        vs::upair_t rs;
        
        // properties level
        NSDictionary* con;
        for (id attr in obj) {
            
            // condition level
            con = [obj objectForKey:attr];
            if (con[@"equal"] != nil) {
                rs.insert({
                    [attr UTF8String],
                    get_value(coll->type_of([attr UTF8String]), con, [NSString stringWithFormat:@"equal"])
                });
            } else if (con[@"start"] != nil) {
                
                rs.insert({
                    [attr UTF8String],
                    get_value(coll->type_of([attr UTF8String]), con, [NSString stringWithFormat:@"start"])
                });
            }
        }
        
        return rs;
    }
    
    const char* create_dir(const char* name) {
        
        NSArray *pathArray = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
        NSString* rootPath = [pathArray objectAtIndex:0];

        NSString *newDir = [rootPath stringByAppendingFormat:@"/%s", name];

        NSError * error = nil;
        [[NSFileManager defaultManager] createDirectoryAtPath:newDir
                                  withIntermediateDirectories:YES
                                                   attributes:nil
                                                        error:&error];
        if (error != nil) {
            return [rootPath UTF8String];
        } else {
            return [newDir UTF8String];
        }
    }
    
} // namespace vasern
