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
    
    template<typename T>
    struct value_i {
        T value;
        std::unordered_map<std::string, value_t*> items;
    };
    
    template <typename T>
    struct result_t {
        size_t count;
        std::vector<T> items;
    };
    
    struct upair_t {
        std::unordered_map<std::string, value_t*> items;
    };
    
    bool operator < (const value_i<size_t> & a, const value_i<size_t> & b) {
        return a.value < b.value;
    }
    
    bool operator == (const value_i<size_t> & a, const value_i<size_t> & b) {
        return a.value == b.value;
    }
}

#endif /* v_value_h */
