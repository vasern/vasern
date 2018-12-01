//
//  index_double.h
//  Vasern
//
//  Created by Hieu (Jack) Nguyen on 26/11/18.
//  Copyright © 2018 Hieu (Jack) Nguyen. All rights reserved.
//

#ifndef index_double_h
#define index_double_h

#include "index_t.h"

namespace vs {
    
    class index_double: public index_t {
    public:
        
        index_double()
        : index_t(DOUBLE_N)
        { }
        
        void push(value_t* key, value_ptr value) {
            if (items.count(key->double_value()) == 0) {
                items[key->double_value()] = std::vector<value_ptr> { value };
            } else {
                items[key->double_value()].push_back(value);
            }
        }
        
        void update(value_t* old_key, value_t* key) {
            auto values = items[old_key->double_value()];
            items.erase(old_key->double_value());
            items[key->double_value()] = values;
        }
        
        void remove(value_t* key) {
            items.erase(key->double_value());
        }
        
        std::vector<value_ptr> get(value_t* key) {
            return items[key->double_value()];
        }
        
    private:
        std::unordered_map<double, std::vector<value_ptr>> items;
    };
    
}


#endif /* index_double_h */
