//
//  index_set.cpp
//  Vasern
//
//  Created by Hieu (Jack) Nguyen on 25/11/18.
//  Copyright © 2018 Hieu (Jack) Nguyen. All rights reserved.
//

#include "index_set.inl"
#include "index_types/index_f.h"
#include <algorithm>

namespace vs {
    
    template<typename T>
    index_set<T>::index_set(std::unordered_map<std::string, prop_desc_t> args)
    {
        for (auto it : args) {
            _set[it.first] = index_f::create(it.second);
        }
    }
    
    template<typename T>
    void index_set<T>::push(value_i<T> value) {
        
        std::shared_ptr<value_i<T>> ab(&value);
        
        // Push value pointer into each index set
        for (auto s : _set) {
            for (auto k: value.items) {
                s.second->push(k.second, ab);
            }
        }
    }
    
    // Merge two vector<value_ptr>
    
    std::vector<value_ptr> unique_merge(std::vector<value_ptr> c1, std::vector<value_ptr> c2)
    {
        std::sort(c1.begin(), c1.end());
        std::sort(c2.begin(), c2.end());
        std::vector<value_ptr> mergeTarget;
        std::merge(c1.begin(), c1.end(), c2.begin(), c2.end(),
                   std::insert_iterator<std::vector<value_ptr>>(mergeTarget, mergeTarget.end())
                   );
        mergeTarget.erase(
                          std::unique(mergeTarget.begin(), mergeTarget.end()),
                          mergeTarget.end()
                          );
        
        return mergeTarget;
    }
    
    // Get all values within the query, remove duplicate
    // then return these values
    template<typename T>
    std::vector<value_ptr> index_set<T>::filter(upair_t query) {
        
        std::vector<value_ptr> list;
        
        for (auto itr : query.items) {
            auto items = _set[itr.first];
            auto value = itr.second;
            std::vector<value_ptr> found = items->get(value);
            
            list = unique_merge(list, found);
        }
        return list;
    }
}
