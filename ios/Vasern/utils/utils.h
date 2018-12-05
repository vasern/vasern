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
#include "../fsms/collect_t.h"

namespace vs_utils_ios {
    
    // Get and convert vector of records into an array
    // This method is used when passing record to JavaScript side
    NSArray* to_nsarray(std::vector<vs::record_t*>, vs::desc_t*);
    NSArray* to_nsarray(std::vector<vs::record_t*>, vs::desc_t*, long start, long end);
    
    // Convert dictionary into query
    // This method is used when JavaScript side send a records request with filters
    vs::upair_t to_query(std::shared_ptr<vs::collect_t>, NSDictionary* obj);
    
    // Create directory for ios
    // This method is used to setup storage directories
    const char* create_dir(const char* name);
    
    template <typename T>
    std::vector<T> to_vector(NSArray*);
    
}


#endif /* vasern_utils_h */
