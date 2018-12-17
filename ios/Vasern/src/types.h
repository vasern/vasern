#ifndef types_h
#define types_h

#include <unordered_map>
#include <string>
#include "values/value_t.h"
#include "index_set/value_i.h"
#include "enums.h"

namespace vs {
    
    struct prop_desc_t {
        int represent;
        type_desc_t type;
    };
    
    typedef std::unordered_map<std::string, value_t*> upair_t;
    typedef std::vector<value_t*> ulist_t;
    typedef std::shared_ptr<value_i<size_t>> value_ptr;
}

#endif
