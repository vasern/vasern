//
//  index_str.h
//  Vasern
//
//  Created by Hieu (Jack) Nguyen on 26/11/18.
//  Copyright © 2018 Hieu (Jack) Nguyen. All rights reserved.
//

#ifndef index_str_h
#define index_str_h

#include "index_t.h"
#include <string>

namespace vs {
    
    class index_str: public index_t {
    public:
        
        index_str()
        : index_t(STRING)
        { }
        
        void push(value_t* key, value_ptr value) {
            if (items.count(key->str_value()) == 0) {
                items[key->str_value()] = std::vector<value_ptr> { value };
            } else {
                items[key->str_value()].push_back(value);
            }
        }
        
        void update(value_t* old_key, value_t* key) {
            auto values = items[old_key->str_value()];
            items.erase(old_key->str_value());
            items[key->str_value()] = values;
        }
        
        void remove(value_t* key, value_ptr value) {
            auto vec = &items[key->str_value()];
            
            vec->erase(std::remove_if(vec->begin(), vec->end(), [&value](value_ptr ptr){ return ptr == value; }), vec->end());
        }
        
        std::vector<value_ptr> get(value_t* key) {
            return items[key->str_value()];
        }
        
        void clear() {
            items.clear();
        }
        
        void move(value_t* old_key, value_t* key, value_ptr ptr) {
            
            std::remove(items[old_key->str_value()].begin(), items[old_key->str_value()].end(), ptr);
            
            if (items.count(key->str_value()) == 0) {
                items[key->str_value()] = std::vector<value_ptr>({ ptr });
            } else {
                items[key->str_value()].push_back(ptr);
            }
            
        }
    private:
        std::unordered_map<std::string, std::vector<value_ptr>> items;
    };
    
}

#endif /* index_str_h */
