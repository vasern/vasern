//
//  col_int_t.h
//  fsms
//
//  Created by Hieu (Jack) Nguyen on 22/11/18.
//  Copyright © 2018 Ambi Studio. All rights reserved.
//

#ifndef col_int_t_h
#define col_int_t_h

#include "col_t.h"

namespace vs {
    
    class col_int_t : public col_t {
        
    public:
        
        col_int_t( const char* name, int val )
        : col_t(name, INT_N)
        , value(val)
        { }
        
        const char* c_str() {
            return (char*)&value;
        }
        
        size_t size() {
            return 4;
        }
        
        void set(int v) {
            value = v;
        }
        
    private:
        int value;
        
    };
    
}

#endif /* col_int_t_h */
