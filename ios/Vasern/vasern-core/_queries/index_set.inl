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
    
    template index_set<size_t>::index_set(std::unordered_map<std::string, prop_desc_t> args);
    template void index_set<size_t>::push(value_i<size_t> value);
    template std::vector<value_ptr> index_set<size_t>::filter(upair_t query);
    
}

#endif /* index_set_h */
