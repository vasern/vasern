//
//  index_t.cpp
//  Vasern
//
//  Created by Hieu (Jack) Nguyen on 25/11/18.
//  Copyright © 2018 Hieu (Jack) Nguyen. All rights reserved.
//

#include "index_t.h"

namespace vs {
    
//    template<typename T>
//    index_t<T>::index_t()
//    : _type(BOOLEAN)
//    { }
//    
//    template<typename T>
//    index_t<T>::index_t(prop_desc_t type)
//    : _type(type)
//    { };
//    
//    template<typename T>
//    bool
//    index_t<T>::is(prop_desc_t compare_type) {
//        return compare_type == _type;
//    }
//    
//    template<typename T>
//    void
//    index_t<T>::push(T key, std::shared_ptr<v_value<size_t>> i_ptr) {
//        
//        if (items.count(key) == 0) {
//            items[key] = std::vector<std::shared_ptr<v_value<size_t>>>{ i_ptr };
//        } else {
//            items[key].push_back(i_ptr);
//        }
//    }
//    
//    template<typename T>
//    void
//    index_t<T>::remove(T key) {
//        items.erase(key);
//    };
//    
//    template<typename T>
//    void
//    index_t<T>::update(T old_key, T key) {
//        std::vector<std::shared_ptr<v_value<size_t>>> value = items[old_key];
//        items.erase(old_key);
//        items[key] = value;
//        
//        // TODO: Update iitem value;
//        
//    };
//    
//    template<typename T>
//    std::vector<std::shared_ptr<v_value<size_t>>>
//    index_t<T>::get(T key) {
//        std::vector<std::shared_ptr<v_value<size_t>>> vec;
//        
//        if (items.count(key) > 0) {
//            vec = items[key];
//        }
//        
//        return vec;
//    }
}
