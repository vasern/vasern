//
//  index_int.h
//  Vasern
//
//  Created by Hieu (Jack) Nguyen on 26/11/18.
//  Copyright © 2018 Hieu (Jack) Nguyen. All rights reserved.
//

#ifndef index_int_h
#define index_int_h

#include "index_t.h"
#include "../value_f.h"

namespace vs {
    
    class index_int: public index_t {
    public:
        
        index_int()
        : index_t(INT_N)
        { }
        
        void push(value_t* key, value_ptr value) {
            if (items.count(key->int_value()) == 0) {
                items[key->int_value()] = std::vector<value_ptr> { value };
            } else {
                items[key->int_value()].push_back(value);
            }
        }
        
        void update(value_t* old_key, value_t* key) {
            auto values = items[old_key->int_value()];
            items.erase(old_key->int_value());
            items[key->int_value()] = values;
        }
        
        void remove(value_t* key, value_ptr value) {
            auto vec = &items[key->int_value()];
            
            vec->erase(std::remove_if(vec->begin(), vec->end(), [&value](value_ptr ptr){ return ptr == value; }), vec->end());
        }
        
        std::vector<value_ptr> get(value_t* key) {
            return items[key->int_value()];
        }
        
        std::vector<value_ptr> range(value_t* value) {
            std::vector<value_ptr> rs;
            std::vector<value_ptr> temp;
            for (auto itr: items) {
                if (value->is_in_range(value_f::create( itr.first ))) {
                    rs.reserve(temp.size() + itr.second.size());
                    rs.insert(rs.end(), temp.begin(), temp.end());
                    rs.insert(rs.end(), itr.second.begin(), itr.second.end());
                    temp = rs;
                }
            }
            
            return rs;
        }
        
    private:
        std::unordered_map<int, std::vector<value_ptr>> items;
    };
    
}

#endif /* index_int_h */
