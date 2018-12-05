//
//  value_f.h
//  Vasern
//
//  Created by Hieu (Jack) Nguyen on 5/12/18.
//  Copyright © 2018 Hieu (Jack) Nguyen. All rights reserved.
//

#ifndef value_f_h
#define value_f_h

#include "../../io/record_t.h"
#include "value_t.h"

namespace vs {
    
    struct value_f {
        
        static value_t* create(const char* value) {
            return new value_str{ value };
        }
        
        static value_t* create(std::string value) {
            return new value_str{ value };
        }
        
        static value_t* create(int value) {
            return new value_int { value };
        }
        
        static value_t* create(bool value) {
            return new value_bool { value };
        }
        
        static value_t* create(double value) {
            return new value_double { value };
        }
        
        static value_t* create(long value) {
            return new value_long { value };
        }
        
        static value_t* create(long start, long end) {
            return new value_range_long(start, end);
        }
        
        static value_t* create(int start, int end) {
            return new value_range_int(start, end);
        }
        
        static value_t* create(double start, double end) {
            return new value_range_double(start, end);
        }
        
        static value_t* create(record_t* r, prop_desc_t type, const char* key) {
            
            switch(type) {
                case STRING:
                case KEY:
                    return create(r->str_value(key));
                case INT_N:
                    return create(r->int_value(key));
                case LONG_N:
                    return create(r->long_value(key));
                case DOUBLE_N:
                    return create(r->double_value(key));
                case BOOLEAN:
                    return create(r->bool_value(key));
            }
            
            // TODO: create an invalid_type or through an error
            return new value_t;
        }
    };
}

#endif /* value_f_h */
