//
//  index_t.hpp
//  Vasern
//
//  Created by Hieu (Jack) Nguyen on 18/11/18.
//  Copyright © 2018 Hieu (Jack) Nguyen. All rights reserved.
//

#ifndef index_t_hpp
#define index_t_hpp

#include "../../../types/enums.h"
#include "../value_i.h"

#include <unordered_map>
#include <vector>

namespace vs {
    
    typedef std::shared_ptr<value_i<size_t>> value_ptr;
    
    class index_t {
    public:
        
        index_t() { };
        index_t(prop_desc_t type): _type(type) { };
        ~index_t() { };
        
        virtual
        void push(value_t* key, value_ptr value) { };
        
        virtual
        void update(value_t* old_key, value_t* key) { };
        
        virtual
        void remove(value_t* key) { };
        
        virtual
        std::vector<value_ptr> get(value_t* key) {
            return std::vector<value_ptr>();
            
        };
        
        virtual
        std::vector<value_ptr> range(value_t* value) {
            return std::vector<value_ptr>();
        };
        
        bool is(prop_desc_t compare_type) {
            return _type == compare_type;
        }
        
        prop_desc_t type() {
            return _type;
        }
    private:
        prop_desc_t _type;
    };
}


#endif /* index_t_hpp */
