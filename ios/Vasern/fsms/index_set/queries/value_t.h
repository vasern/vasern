//
//  value_t.h
//  Vasern
//
//  Created by Hieu (Jack) Nguyen on 26/11/18.
//  Copyright © 2018 Hieu (Jack) Nguyen. All rights reserved.
//

#ifndef value_t_h
#define value_t_h

#include "../../types/enums.h"
#include "../../io/record_t.h"

namespace vs {
    struct value_t {
        
        virtual bool is_range() { return false; };
        virtual bool is_in_range(value_t*) { return false; };
        virtual bool is_in_range_e(value_t*) { return false; };
        
        virtual int int_value() { return 0; };
        virtual const char* str_value() { return ""; };
        virtual bool bool_value() { return false; };
        virtual long long_value() { return 0; };
        virtual double double_value() { return 0.0; };
        virtual bool is_match(value_t *) { return false; };
        
        virtual bool is_gt(value_t*) { return false; }
        virtual bool is_lt(value_t*) { return false; }
        virtual bool is_gte(value_t*) { return false; }
        virtual bool is_lte(value_t*) { return false; }
    };
    
    struct value_str
    : public value_t
    {
        value_str(const char* v)
        : value(v) { }
        
        value_str(std::string v)
        : value(v) { }
        
        std::string value;
        
        const char* str_value() {
            return value.c_str();
        }
        
        bool is_match(value_t* cmp) {
            return value.compare(cmp->str_value()) == 0;
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
        
        bool is_match(value_t* cmp) {
            return value == cmp->int_value();
        }
        
        bool is_gt(value_t* cmp) {
            return value > cmp->int_value();
        }
        
        bool is_lt(value_t* cmp) {
            return value < cmp->int_value();
        }
        
        bool is_gte(value_t* cmp) {
            return value >= cmp->int_value();
        }
        
        bool is_lte(value_t* cmp) {
            return value <= cmp->int_value();
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
        
        bool is_match(value_t* cmp) {
            return value == cmp->bool_value();
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
        
        bool is_match(value_t* cmp) {
            return value == cmp->long_value();
        }
        
        bool is_gt(value_t* cmp) {
            return value > cmp->long_value();
        }
        
        bool is_lt(value_t* cmp) {
            return value < cmp->long_value();
        }
        
        bool is_gte(value_t* cmp) {
            return value >= cmp->long_value();
        }
        
        bool is_lte(value_t* cmp) {
            return value <= cmp->long_value();
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
        
        bool is_match(value_t* cmp) {
            return value == cmp->double_value();
        }
        
        bool is_gt(value_t* cmp) {
            return value > cmp->double_value();
        }
        
        
        bool is_lt(value_t* cmp) {
            return value < cmp->double_value();
        }
        
        bool is_gte(value_t* cmp) {
            return value >= cmp->double_value();
        }
        
        
        bool is_lte(value_t* cmp) {
            return value <= cmp->double_value();
        }
    };
    
    struct value_range_double
    : public value_t
    {
        double start;
        double end;
        
        value_range_double(double s, double e)
        : start(s), end(e) { }
        
        bool is_in_range(value_t* cmp) {
            return end > cmp->double_value() && start < cmp->double_value();
        }
        
        bool is_in_range_e(value_t* cmp) {
            return end >= cmp->double_value() && start < cmp->double_value();
        }
        
        bool is_range() {
            return true;
        }
    };
    
    struct value_range_long
    : public value_t
    {
        long start;
        long end;
        
        value_range_long(long s, long e)
        : start(s), end(e) { }
        
        bool is_in_range(value_t* cmp) {
            return end > cmp->long_value() && start < cmp->long_value();
        }
        
        bool is_in_range_e(value_t* cmp) {
            return end >= cmp->long_value() && start < cmp->long_value();
        }
        
        bool is_range() {
            return true;
        }
    };
    
    struct value_range_int
    : public value_t
    {
        int start;
        int end;
        
        value_range_int(int s, int e)
        : start(s), end(e) { }
        
        bool is_in_range(value_t* cmp) {
            return end > cmp->int_value() && start < cmp->int_value();
        }
        
        bool is_in_range_e(value_t* cmp) {
            return end >= cmp->int_value() && start < cmp->int_value();
        }
        
        bool is_range() {
            return true;
        }
    };
    
    
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

#endif /* value_t_h */
