//
//  index_set.hpp
//  Vasern
//
//  Created by Hieu (Jack) Nguyen on 25/11/18.
//  Copyright © 2018 Hieu (Jack) Nguyen. All rights reserved.
//

#ifndef index_set_hpp
#define index_set_hpp

#include <string>
#include <unordered_map>

#include "index_types/index_t.h"
#include "value_i.h"

namespace vs {
    
    template<typename T>
    class index_set {
    public:
        index_set();
        
        index_set(std::unordered_map<std::string, prop_desc_t> args);
        
        void push(value_i<T> value);
        std::vector<value_ptr> filter(upair_t);
        size_t get(upair_t);
        
    private:
        std::unordered_map<std::string, index_t*> _set;
    };
}

#endif /* index_set_hpp */
