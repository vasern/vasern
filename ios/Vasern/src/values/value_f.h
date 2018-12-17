//
//  value_f.h
//  Vasern
//
//  Created by Hieu (Jack) Nguyen on 5/12/18.
//  Copyright © 2018 Hieu (Jack) Nguyen. All rights reserved.
//

#ifndef value_f_h
#define value_f_h

#include "../types.h"
#include <unordered_map>
#include <string>

namespace vs {

    struct value_f {
        
        static value_t* create(const char* value) {
            return new value_str(value);
        }
        
        static value_t* create(std::string value) {
            return new value_str(value);
        }
        
        static value_t* create(const char* value, int len) {
            return new value_str(value, len);
        }
        
        static value_t* create(std::string value, int len) {
            return new value_str(value, len);
        }
        
        static value_t* create(bool value) {
            return new value_bool(value);
        }
        
        static value_t* create(float value) {
            return new value_number(value);
        }
        
        static value_t* create(int value) {
            return new value_number(value);
        }
        
        static value_t* create(double value) {
            return new value_number(value);
        }
        
        static value_t* create(long value) {
            return new value_number(value);
        }
        
        static value_t* create(upair_t values) {
            return new value_obj(values);
        }
        
        static value_t* create(ulist_t values) {
            return new value_list(values);
        }
        
        static value_t* create(double start, double end) {
            return new value_range_number(start, end);
        }
    };
}

#endif /* value_f_h */
