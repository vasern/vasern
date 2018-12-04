//
//  v_value.h
//  Vasern
//
//  Created by Hieu (Jack) Nguyen on 26/11/18.
//  Copyright © 2018 Hieu (Jack) Nguyen. All rights reserved.
//

#ifndef v_value_h
#define v_value_h

#include <unordered_map>
#include <string>
#include <vector>
#include "value_t.h"

namespace vs {
    
    typedef std::unordered_map<std::string, value_t*> upair_t;
    
    template<typename T>
    struct value_i {
        T value;
        upair_t items;
        
        bool match_query(upair_t *query, const char* exclude) {
            
            for (auto itr: *query) {
                
                if (itr.first.compare(exclude) != 0) {
                    
                    if(itr.second->is_match(items[itr.first]) == false) {
                        return false;
                    };
                    
                }
            }
            
            return true;
        }
    };
    
    template <typename T>
    struct result_t {
        size_t count;
        std::vector<T> items;
    };
}

#endif /* v_value_h */
