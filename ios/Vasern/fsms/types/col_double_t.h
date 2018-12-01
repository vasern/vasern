//
//  col_double_t.h
//  fsms
//
//  Created by Hieu (Jack) Nguyen on 22/11/18.
//  Copyright © 2018 Ambi Studio. All rights reserved.
//

#ifndef col_double_t_h
#define col_double_t_h


#include "col_t.h"

namespace vs {
    
    class col_double_t : public col_t {
        
    public:
        
        col_double_t( const char* name, double val )
        : col_t(name, DOUBLE_N)
        , value(val)
        { }
        
        const char* c_str() {
            return (char*)&value;
        }
        
        size_t size() {
            return 8;
        }
        
        void set(double v) {
            value = v;
        }
        
    private:
        
        double value;
        
    };
    
}

#endif /* col_double_t_h */
