//
//  value_t.h
//  Vasern
//
//  Created by Hieu (Jack) Nguyen on 26/11/18.
//  Copyright © 2018 Hieu (Jack) Nguyen. All rights reserved.
//

#ifndef value_t_h
#define value_t_h


#include <string>
#include <unordered_map>
#include <vector>

#include "../enums.h"

namespace vs {
    
    // forward declaration
    class block_writer;
    
    struct value_t {

        type_desc_t type;

        value_t(type_desc_t t) : type(t) { }
        
        virtual int size() { return -1; };
        virtual bool is_range() { return false; };
        virtual bool is_in_range(value_t*) { return false; };
        virtual bool is_in_range_e(value_t*) { return false; };
        
        virtual std::unordered_map<std::string, value_t*> object() {
            return std::unordered_map<std::string, value_t*>();
        }
        
        virtual std::vector<value_t*> list_values() {
            return std::vector<value_t*>();
        }
        
        virtual const char* str_value() { return ""; };
        virtual bool bool_value() { return false; };
        virtual double number_value() { return -1; };
        
        virtual bool is_match(value_t *) { return false; };
        virtual bool is_gt(value_t*) { return false; }
        virtual bool is_lt(value_t*) { return false; }
        virtual bool is_gte(value_t*) { return false; }
        virtual bool is_lte(value_t*) { return false; }

        virtual void assign(block_writer* stream) {};
        virtual void assign(block_writer* stream, int len) {};
    };
    
    struct value_str
    : value_t
    {
        value_str(const char* v)
        : value_t(STRING), value(v) {
            _size = (int)value.size();
        }
        
        value_str(std::string v)
        : value_t(STRING), value(v) {
            _size = (int)value.size();
        }
        
        value_str(const char* v, int size)
        : value_t(STRING), value(v), _size(size)
        { }
        
        value_str(std::string v, int size)
        : value_t(STRING), value(v), _size(size)
        { }
        
        const char* str_value() {
            return value.c_str();
        }
        
        bool is_match(value_t* cmp) {
            return value.compare(cmp->str_value()) == 0;
        }
        
        bool is_gt(value_t* cmp) {
            return value.compare(cmp->str_value()) < 0;
        }
        
        bool is_lt(value_t* cmp) {
            return value.compare(cmp->str_value()) > 0;
        }

        int size() {
            return _size;
        }

        void assign(block_writer* stream);              // use for dynamic size string
        void assign(block_writer* stream, int len);     // use for fixed size string
    
        int _size;
        std::string value;
    };
    
    struct value_number
    : value_t
    {
        double value;
        
        value_number(double v)
        : value_t(NUMBER), value(v) { }
        
        double number_value() {
            return value;
        }

        const char* str_value() {
            return (char*)&value;
        }
        
        bool is_match(value_t* cmp) {
            return value == cmp->number_value();
        }
        
        bool is_gt(value_t* cmp) {
            return value > cmp->number_value();
        }
        
        bool is_lt(value_t* cmp) {
            return value < cmp->number_value();
        }
        
        bool is_gte(value_t* cmp) {
            return value >= cmp->number_value();
        }
        
        bool is_lte(value_t* cmp) {
            return value <= cmp->number_value();
        }

        int size() {
            return 8;
        }

        void assign(block_writer* stream);
        void assign(block_writer* stream, int len);
    };
    
    struct value_bool
    : value_t
    {
        bool value;
        
        value_bool(bool v)
        : value_t(BOOLEAN),  value(v) { }
        
        bool bool_value() {
            return value;
        }

        const char* str_value() {
            return (char*)&value;
        }
        
        bool is_match(value_t* cmp) {
            return value == cmp->bool_value();
        }

        int size() {
            return 1;
        }

        void assign(block_writer* stream);
        void assign(block_writer* stream, int len);
    };
    
    struct value_list
    : value_t {
        std::vector<value_t*> values;
        
        value_list(std::vector<value_t*> v)
        : value_t(LIST), values(v) { }
        
        std::vector<value_t*> list_values() {
            return values;
        }

        void assign(block_writer* stream);
        void assign(block_writer* stream, int len);
    };
    
    struct value_obj
    : value_t {
        
        std::unordered_map<std::string, value_t*> values;
        
        value_obj(std::unordered_map<std::string, value_t*> v)
        : value_t(OBJECT), values(v) { }
        
        std::unordered_map<std::string, value_t*> object() {
            return values;
        }

        void assign(block_writer* stream);
        void assign(block_writer* stream, int len);
    };
    
    struct value_range_number
    : public value_t
    {
        double start;
        double end;
        
        value_range_number(double s, double e)
        : value_t(RANGE_NUMBER), start(s), end(e) { }
        
        bool is_in_range(value_t* cmp) {
            return end > cmp->number_value() && start < cmp->number_value();
        }
        
        bool is_in_range_e(value_t* cmp) {
            return end >= cmp->number_value() && start < cmp->number_value();
        }
        
        bool is_range() {
            return true;
        }
    };
}

#endif /* value_t_h */
