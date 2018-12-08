//
//  types.h
//  Vasern
//
//  Created by Hieu (Jack) Nguyen on 5/12/18.
//  Copyright © 2018 Hieu (Jack) Nguyen. All rights reserved.
//

#ifndef t_types_h
#define t_types_h


#include <vector>
#include <unordered_map>

#include "col_str_t.h"
#include "col_key_t.h"
#include "col_t.h"
#include "../index_set/queries/q_types.h"

namespace vs {
    
    struct row_desc_t {
        col_key_t key;
        col_str_t value;
        std::vector<col_t*> indexes;
        upair_t pairs;
    };
    
    extern std::unordered_map<std::string, prop_desc_t> type_mapped_str;
}

#endif /* types_h */
