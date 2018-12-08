//
//  col_str_t.h
//  fsms
//
//  Created by Hieu (Jack) Nguyen on 22/11/18.
//  Copyright © 2018 Ambi Studio. All rights reserved.
//

#ifndef col_str_t_h
#define col_str_t_h

#include "col_t.h"
#include <string>

namespace vs {
    
    class col_str_t : public col_t {
        
    public:
        
        col_str_t( const char* name, std::string val, size_t size )
        : col_t(name, STRING)
        , value(val)
        , b_size(size)
        { }
        
        col_str_t( const char* name, std::string val )
        : col_t(name, STRING)
        , value(val)
        , b_size(55)
        { }
        
        col_str_t( const char* name, const char* val )
        : col_t(name, STRING)
        , value(val)
        , b_size(55)
        { }
        
        const char* c_str() {
            return value.c_str();
        }
        
        size_t size() {
            return b_size;
        }
        
        size_t data_size() {
            return value.size();
        }
        
        void set(const char* v) {
            value.assign(v);
        }
    private:
        
        std::string value;
        size_t b_size;
        
    };
    
}

#endif /* col_str_t_h */
