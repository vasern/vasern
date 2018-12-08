//
//  index_set.inl
//  Vasern
//
//  Created by Hieu (Jack) Nguyen on 26/11/18.
//  Copyright © 2018 Hieu (Jack) Nguyen. All rights reserved.
//

#ifndef index_set_h
#define index_set_h

#include "index_set.h"

namespace vs {
    
    template index_set<size_t>::index_set();
    template index_set<size_t>::index_set(std::unordered_map<std::string, prop_desc_t> args);
    
    template void index_set<size_t>::push(std::shared_ptr<value_i<size_t>> value);
    template void index_set<size_t>::remove(value_ptr);
    
    template std::vector<value_ptr> index_set<size_t>::filter(upair_t*);
    template std::vector<value_ptr> index_set<size_t>::filter(upair_t*, const char*, bool);
    
    template void index_set<size_t>::sort(std::vector<value_ptr>*, const char*, bool);
    template const char* index_set<size_t>::get_id(upair_t*);
    
    template value_ptr index_set<size_t>::get(upair_t*);
    template prop_desc_t index_set<size_t>::type_of(const char*);
}

#endif /* index_set_h */
