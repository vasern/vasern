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
#include "../../values/value_f.h"

namespace vs {
    
    class index_number: public index_t {
    public:
        
        index_number()
        : index_t(NUMBER)
        { }
        
        void push(value_t* key, value_ptr value) {
            if (items.count(key->number_value()) == 0) {
                items[key->number_value()] = std::vector<value_ptr> { value };
            } else {
                items[key->number_value()].push_back(value);
            }
        }
        
        void update(value_t* old_key, value_t* key) {
            auto values = items[old_key->number_value()];
            items.erase(old_key->number_value());
            items[key->number_value()] = values;
        }
        
        void remove(value_t* key, value_ptr value) {
            auto vec = &items[key->number_value()];
            
            vec->erase(std::remove_if(vec->begin(), vec->end(), [&value](value_ptr ptr){ return ptr == value; }), vec->end());
        }
        
        std::vector<value_ptr> get(value_t* key) {
            return items[key->number_value()];
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
