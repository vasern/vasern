//
//  vasern_utils.h
//  Vasern
//
//  Created by Hieu (Jack) Nguyen on 11/10/18.
//  Copyright © 2018 Hieu (Jack) Nguyen. All rights reserved.
//

#ifndef vasern_utils_h
#define vasern_utils_h

#import <Foundation/Foundation.h>
#import <string>
#import <vector>
#include "../src/collect_t.h"

namespace vs_utils_ios {
    
    // Get and convert vector of records into an array
    // This method is used when passing record to JavaScript side
    NSArray* to_nsarray(std::vector<vs::block_reader*> r);
    NSArray* to_nsarray(std::vector<vs::block_reader*>, long start, long end);
    
    // Convert dictionary into query
    // This method is used when JavaScript side send a records request with filters
    vs::upair_t to_query(std::shared_ptr<vs::collect_t>, NSDictionary* obj);
    
    void obj_to_upair(NSString *type, vs::upair_t* r, NSDictionary *obj);
    void array_to_ulist(NSString *type, std::vector<vs::value_t*>* ulist, NSArray *rObj);
    
    NSDictionary* upair_to_obj(vs::upair_t pairs);
    NSArray* ulist_to_array(vs::ulist_t list);
    
    // Create directory for ios
    // This method is used to setup storage directories
    const char* create_dir(const char* name);
    
    template <typename T>
    std::vector<T> to_vector(NSArray*);
    
    vs::type_desc_t type_of(NSObject* any);
    
    std::unordered_map<std::string, vs::layout_t> to_database_model(NSDictionary*);
}


#endif /* vasern_utils_h */
