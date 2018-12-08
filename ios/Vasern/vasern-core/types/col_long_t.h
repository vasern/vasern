//
//  col_long_t.h
//  fsms
//
//  Created by Hieu (Jack) Nguyen on 22/11/18.
//  Copyright © 2018 Ambi Studio. All rights reserved.
//

#ifndef col_long_t_h
#define col_long_t_h


#include "col_t.h"

namespace vs {
    
    class col_long_t : public col_t {
        
    public:
        
        col_long_t( const char* name, long val )
        : col_t(name, LONG_N)
        , value(val)
        { }
        
        const char* c_str() {
            return (char*)&value;
        }
        
        size_t size() {
            return 8;
        }
        
        void set(long v) {
            value = v;
        }
    private:
        
        long value;
        
    };
    
}

#endif /* col_long_t_h */
