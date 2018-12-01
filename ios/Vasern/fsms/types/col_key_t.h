//
//  col_key_t.h
//  fsms
//
//  Created by Hieu (Jack) Nguyen on 22/11/18.
//  Copyright © 2018 Ambi Studio. All rights reserved.
//

#ifndef col_key_t_h
#define col_key_t_h


#include "col_t.h"
#include <string>

namespace vs {
    
    class col_key_t : public col_t {
        
    public:
        
        col_key_t( const char* name, std::string val )
        : col_t(name, STRING)
        , value(val)
        , b_size(32)
        { }
        
        col_key_t( const char* name, const char* val )
        : col_t(name, STRING)
        , value(val)
        , b_size(32)
        { }
        
        const char* c_str() {
            return value.c_str();
        }
        
        size_t size() {
            return b_size;
        }
        
        void set(const char* v) {
            value.assign(v);
        }
    private:
        
        std::string value;
        size_t b_size;
        
    };
    
}

#endif /* col_key_t_h */
