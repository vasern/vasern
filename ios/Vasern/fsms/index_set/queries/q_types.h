//
//  types.h
//  Vasern
//
//  Created by Hieu (Jack) Nguyen on 5/12/18.
//  Copyright © 2018 Hieu (Jack) Nguyen. All rights reserved.
//

#ifndef q_types_h
#define q_types_h

#include <unordered_map>
#include <string>
#include "value_t.h"

namespace vs {
    
    typedef std::unordered_map<std::string, value_t*> upair_t;
}

#endif /* types_h */
