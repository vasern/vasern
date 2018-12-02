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
    
    template <typename T>
    index_set<T>::index_set() { }
    
    template<typename T>
    index_set<T>::index_set(std::unordered_map<std::string, prop_desc_t> args)
    {
        for (auto it : args) {
            _set[it.first] = index_f::create(it.second);
        }
    }
    
    template<typename T>
    void index_set<T>::push(std::shared_ptr<value_i<T>> value) {
        
        // Push value pointer into each index set
        for (auto k : value->items) {
            _set[k.first]->push(k.second, value);
        }
//        for (auto s : _set) {
////            s.second->push(value->items[s.first])
//            for (auto k: value->items) {
//                s.second->push(k.second, value);
//            }
//        }
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
    std::vector<value_ptr> index_set<T>::filter(upair_t* query) {
        
        // TODO: first itr shouldn't be bool
        std::vector<value_ptr> list;
        
        auto itr = query->begin();
        
        if (type_of(itr->first.c_str()) == BOOLEAN) {
            if (std::next(itr) != query->end()) {
                itr = std::next(itr);
            }
        }
        
        std::vector<value_ptr> candidates = _set[itr->first]->get(itr->second);
        const char* exclude = itr->first.c_str();
        
        for (value_ptr ptr : candidates) {
            if (ptr->match_query(query, exclude)) {
                list.push_back(ptr);
            }
        }
    
        return list;
    }
    
    template <typename T>
    T index_set<T>::get(upair_t* query) {
        auto itr = query->begin();
        return _set[itr->first]->get(itr->second).front()->value;
    };
    
    template <typename T>
    prop_desc_t index_set<T>::type_of(const char* name) {
        return _set[name]->type();
    }
}
