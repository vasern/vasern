//
//  index_t.hpp
//  Vasern
//
//  Created by Hieu (Jack) Nguyen on 18/11/18.
//  Copyright © 2018 Hieu (Jack) Nguyen. All rights reserved.
//

#ifndef index_t_hpp
#define index_t_hpp

#include "../../types.h"
//#include "../../enums.h"
//#include "../../values/value_t.h"

#include <unordered_map>
#include <vector>
#include <algorithm>

namespace vs {
    
    
    class index_t {
    public:
        
        index_t() { };
        index_t(type_desc_t type): _type(type) { };
        ~index_t() { };
        
        virtual void push(value_t*, value_ptr) { };
        
        virtual void update(value_t*, value_t*) { };
        virtual void move(value_t*, value_t*, value_ptr) { };
        virtual void remove(value_t*, value_ptr) { };
        virtual void clear() { };
        
        virtual std::vector<value_ptr> get(value_t*) {
            return std::vector<value_ptr>();
        };
        
        virtual std::vector<value_ptr> range(value_t*) {
            return std::vector<value_ptr>();
        };
        
        bool is(type_desc_t compare_type) {
            return _type == compare_type;
        }
        
        type_desc_t type() {
            return _type;
        }
    private:
        type_desc_t _type;
    };
}


#endif /* index_t_hpp */
