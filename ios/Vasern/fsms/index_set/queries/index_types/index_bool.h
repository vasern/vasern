//
//  index_bool.h
//  Vasern
//
//  Created by Hieu (Jack) Nguyen on 26/11/18.
//  Copyright © 2018 Hieu (Jack) Nguyen. All rights reserved.
//

#ifndef index_bool_h
#define index_bool_h

#include "index_t.h"

namespace vs {
    
    class index_bool: public index_t {
    public:
        
        index_bool()
        : index_t(BOOLEAN)
        { }
        
        void push(value_t* key, value_ptr value) {
            if (items.count(key->bool_value()) == 0) {
                items[key->bool_value()] = std::vector<value_ptr> { value };
            } else {
                items[key->bool_value()].push_back(value);
            }
        }
        
        void update(value_t* old_key, value_t* key) {
            auto values = items[old_key->bool_value()];
            items.erase(old_key->bool_value());
            items[key->bool_value()] = values;
        }
        
        void remove(value_t* key) {
            items.erase(key->bool_value());
        }
        
        std::vector<value_ptr> get(value_t* key) {
            return items[key->bool_value()];
        }
        
    private:
        std::unordered_map<bool, std::vector<value_ptr>> items;
    };
    
}

#endif /* index_bool_h */
