//
//  value_t.h
//  Vasern
//
//  Created by Hieu (Jack) Nguyen on 26/11/18.
//  Copyright © 2018 Hieu (Jack) Nguyen. All rights reserved.
//

#ifndef value_t_h
#define value_t_h

#include "../types/enums.h"

namespace vs {
    struct value_t {
        virtual int int_value();
        virtual const char* str_value();
        virtual bool bool_value();
        virtual long long_value();
        virtual double double_value();
    };
    
    struct value_str
    : public value_t
    {
        value_str(const char* v)
        : value(v) { }
        
        const char* value;
        
        const char* str_value() {
            return value;
        }
    };
    
    struct value_int
    : public value_t
    {
        int value;
        
        value_int(int v)
        : value(v) { }
        
        int int_value() {
            return value;
        }
    };
    
    struct value_bool
    : public value_t
    {
        bool value;
        
        value_bool(bool v)
        : value(v) { }
        
        bool bool_value() {
            return value;
        }
    };
    
    struct value_long
    : public value_t
    {
        long value;
        
        value_long(long v)
        : value(v) { }
        
        long long_value() {
            return value;
        }
    };
    
    struct value_double
    : public value_t
    {
        double value;
       
        value_double(double v)
        : value(v) { }
        
        double double_value() {
            return value;
        }
    };
    
    struct value_f {
        
        static value_t* create(const char* value) {
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
        
        static value_t* create(long value ) {
            return new value_long { value };
        }
    };
}

#endif /* value_t_h */
