//================================================================
//
//  Copyright by Ambi Studio 2018
//  Licensed under the Apache License, Version 2.0 (the "License");
//  (Please find "LICENSE" file attached for license details)
//================================================================


#include "utils.h"
#include "../src/values/value_f.h"

namespace vs_utils_ios {
    
    NSArray* ulist_to_array(vs::ulist_t list) {
        NSMutableArray *rs = [NSMutableArray arrayWithCapacity:list.size()];
        
        int i = 0;
        for (auto itr: list) {
            switch (itr->type) {
                case vs::STRING:
                    [rs insertObject:@(itr->str_value()) atIndex:i];
                    break;
                    
                case vs::NUMBER:
                    [rs insertObject:@(itr->number_value()) atIndex:i];
                    break;
                    
                case vs::BOOLEAN:
                    [rs insertObject:@(itr->bool_value()) atIndex:i];
                    break;
                    
                case vs::LIST:
                    [rs insertObject:ulist_to_array(itr->list_values()) atIndex:i];
                    break;
                    
                case vs::OBJECT:
                    [rs insertObject:upair_to_obj(itr->object()) atIndex:i];
                    break;
                    
                default:
                    break;
            }
            i++;
        }
        
        return rs;
    }
    
    NSDictionary* upair_to_obj(vs::upair_t pairs) {
        NSMutableDictionary* rs = [NSMutableDictionary dictionaryWithCapacity:pairs.size()];
        
        for (auto itr: pairs) {
            switch (itr.second->type) {
                case vs::STRING:
                    rs[@(itr.first.c_str())] = @(itr.second->str_value());
                    break;
                    
                case vs::NUMBER:
                    rs[@(itr.first.c_str())] = @(itr.second->number_value());
                    break;
                    
                case vs::BOOLEAN:
                    rs[@(itr.first.c_str())] = @(itr.second->bool_value());
                    break;
                    
                case vs::LIST:
                    rs[@(itr.first.c_str())] = ulist_to_array(itr.second->list_values());
                    break;
                    
                case vs::OBJECT:
                    rs[@(itr.first.c_str())] = upair_to_obj(itr.second->object());
                    break;
                    
                default:
                    break;
            }
        }
        return rs;
    }
    
    
    NSArray* to_nsarray(std::vector<vs::block_reader*> records) {
        NSMutableArray* rs = [NSMutableArray arrayWithCapacity:records.size()];
        
        int i = 0;
        for (auto r: records) {
            [rs insertObject:upair_to_obj(r->object()) atIndex:i];
            i++;
        }
        return rs;
    }
    
    NSArray* to_nsarray(std::vector<vs::block_reader*> records, long start, long end) {
        NSMutableArray* rs = [NSMutableArray arrayWithCapacity:end - start];
//
//        int i = start, rsi = 0;
//        size_t r_size = records.size();
//        if (end > r_size) { end = r_size; };
//
//        NSMutableDictionary* obj;
//        vs::record_t* r;
//        while (i < end) {
//            r = records.at(i);
//            obj = [NSMutableDictionary new];
//            [obj setValue:[NSString stringWithUTF8String:r->key().c_str()] forKey:@"id"];
//            [obj setValue:[NSString stringWithUTF8String:r->value().c_str()] forKey:@"body"];
//
//            for (auto itr : desc->indexes) {
//                assign_objc_native_value(itr->type, obj, r, itr->name.c_str());
//            }
//
//            [rs insertObject:obj atIndex:rsi++];
//            i++;
//        }
//
        return rs;
    }

    vs::value_t* get_value(vs::type_desc_t type, NSDictionary* pair, NSString* key) {
        
        switch (type) {
            case vs::STRING:
                return vs::value_f::create([[pair valueForKey:key] UTF8String]);
            case vs::NUMBER:
                if ([pair count] == 2) {
                    return vs::value_f::create([[pair valueForKey:@"start"] intValue], [[pair valueForKey:@"end"] intValue]);
                }
                return vs::value_f::create([[pair valueForKey:key] intValue]);
            case vs::BOOLEAN:
                return vs::value_f::create([[pair valueForKey:key] boolValue]);
            default:
                break;
        }
        
        return NULL;
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
                    get_value(type_of(con[@"equal"]), con, [NSString stringWithFormat:@"equal"])
                });
            } else if (con[@"start"] != nil) {
                
                rs.insert({
                    [attr UTF8String],
                    get_value(type_of(con[@"start"]), con, [NSString stringWithFormat:@"start"])
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
    
    template<>
    std::vector<const char*> to_vector(NSArray* objects) {
        std::vector<const char*> rs;
        rs.reserve([objects count]);
        
        
        for (id itr in objects) {
            rs.push_back([itr UTF8String]);
        }
        
        return rs;
    };
    
    void obj_to_upair(NSString* type, vs::upair_t* r_pairs, NSDictionary *rObj) {
        
        for (id it in rObj) {
            
            type = [NSString stringWithFormat:@"%@", [rObj[it] class]];
            
            if ([type isEqualToString:@"NSTaggedPointerString"] || [type isEqualToString:@"__NSCFString"]) {
                
                (*r_pairs)[[it UTF8String]] = vs::value_f::create([rObj[it] UTF8String]);
            } else if ([type isEqualToString:@"__NSCFBoolean"]) {
                
                (*r_pairs)[[it UTF8String]] = vs::value_f::create([rObj[it] boolValue]);
            } else if ([type isEqualToString:@"__NSCFNumber"]) {
                (*r_pairs)[[it UTF8String]] = vs::value_f::create([rObj[it] doubleValue]);
            } else if ([type isEqualToString:@"__NSDictionaryM"]) {
                vs::upair_t obj;
                obj_to_upair(type, &obj, [rObj objectForKey:it]);
                (*r_pairs)[[it UTF8String]] = vs::value_f::create(obj);
            } else if ([type isEqualToString:@"__NSArrayM"]) {
                std::vector<vs::value_t*> slist;
                array_to_ulist(type, &slist, [rObj mutableArrayValueForKey:it]);
                (*r_pairs)[[it UTF8String]] = vs::value_f::create(slist);
            } else {
                printf("+++++Type unlo %s\n", [type UTF8String]);
            }
            
        }
    }
    
    void array_to_ulist(NSString *type, std::vector<vs::value_t*>* ulist, NSArray *rObj) {
        
        for (id it in rObj) {
            
            type = [NSString stringWithFormat:@"%@", [it class]];
            
            if ([type isEqualToString:@"NSTaggedPointerString"]) {
                
                ulist->push_back(vs::value_f::create([it UTF8String]));
            } else if ([type isEqualToString:@"__NSCFNumber"]) {
                ulist->push_back(vs::value_f::create([it doubleValue]));
            } else if ([type isEqualToString:@"__NSCFBoolean"]) {
                
                ulist->push_back(vs::value_f::create([it boolValue]));
            } else if ([type isEqualToString:@"__NSDictionaryM"]) {
                vs::upair_t obj;
                obj_to_upair(type, &obj, it);
                ulist->push_back(vs::value_f::create(obj));
            } else if ([type isEqualToString:@"__NSArrayM"]) {
                std::vector<vs::value_t*> slist;
                array_to_ulist(type, &slist, it);
                ulist->push_back(vs::value_f::create(slist));
            } else {
                printf("Type unlo %s\n", [type UTF8String]);
            }
        }
    }
    
    vs::type_desc_t type_of(NSObject* obj) {
        NSString* type = [NSString stringWithFormat:@"%@", [obj class]];
        
        if ([type isEqualToString:@"NSTaggedPointerString"] || [type isEqualToString:@"__NSCFString"]) {
            
            return vs::STRING;
        } else if ([type isEqualToString:@"__NSCFBoolean"]) {
            
            return vs::BOOLEAN;
        } else if ([type isEqualToString:@"__NSCFNumber"]) {
            
            return vs::NUMBER;
        } else if ([type isEqualToString:@"__NSDictionaryM"]) {
            
            return vs::OBJECT;
        } else if ([type isEqualToString:@"__NSArrayM"]) {
            
            return vs::LIST;
        }
        
        return vs::TYPE_UNDEFINED;
    }
    
    std::unordered_map<std::string, vs::layout_t> to_database_model(NSDictionary* model) {
        std::unordered_map<std::string, vs::layout_t> tables;
        NSDictionary *obj, *indexObjs;
        vs::type_desc_t type;
        
        for (id itr in model) {
            
            vs::schema_t schema;
            obj = [model objectForKey:itr];
            
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
        return tables;
    }
}; // namespace vasern
