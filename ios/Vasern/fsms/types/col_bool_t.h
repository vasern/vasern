//
//  col_bool_str.h
//  fsms
//
//  Created by Hieu (Jack) Nguyen on 22/11/18.
//  Copyright © 2018 Ambi Studio. All rights reserved.
//

#ifndef col_bool_t_h
#define col_bool_t_h


#include "col_t.h"

namespace vs {
    
    class col_bool_t : public col_t {
        
    public:
        
        col_bool_t( const char* name, bool val )
        : col_t(name, BOOLEAN)
        , value(val)
        { }
        
        const char* c_str() {
            return (char*)&value;
        }
        
        size_t size() {
            return 1;
        }
        void set(bool v) {
            value = v;
        }
    private:
        bool value;
        
    };
    
}

#endif /* col_bool_str_h */
