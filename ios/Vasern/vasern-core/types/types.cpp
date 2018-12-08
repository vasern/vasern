//
//  types.cpp
//  Vasern
//
//  Created by Hieu (Jack) Nguyen on 5/12/18.
//  Copyright © 2018 Hieu (Jack) Nguyen. All rights reserved.
//

#include "types.h"

namespace vs {
    
    std::unordered_map<std::string, prop_desc_t> type_mapped_str = {
        { "boolean", vs::BOOLEAN },
        { "string", vs::STRING },
        { "ref", vs::STRING },
        { "int", vs::INT_N },
        { "long", vs::LONG_N },
        { "double", vs::DOUBLE_N },
        { "datetime", vs::LONG_N }
    };
}
