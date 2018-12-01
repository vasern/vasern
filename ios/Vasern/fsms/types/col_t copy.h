
#ifndef col_t_h
#define col_t_h

#include "enums.h"
#include <string>

namespace vs {

    class col_t {
    
    public:
        
        prop_desc_t type;
        
        col_t() { }
        
        col_t(const char* _name, prop_desc_t _type)
        : name(_name), type(_type)
        {
            switch(_type) {

                case INT_N:
                    size = 4;
                    break;

                case STRING:
                    size = 255;
                    break;

                case BOOLEAN:
                    size = 1;
                    break;
                    
                case LONG_N:
                case DOUBLE_N:
                    size = 8;
                    break;
            }
        }

        col_t(const char* _name, size_t _size, prop_desc_t _type)
        : name(_name), size(_size), type(_type) { }
        
        col_t(const char* _name, const char* value)
        : name(_name), type(STRING), str_value((char*)value), size(255), fixed(false) { }

        col_t(const char* _name, const char* value, size_t len)
        : name(_name), type(STRING), str_value((char*)value), size(len), fixed(true) { }
        
        col_t(const char* _name, double value)
        : name(_name), type(DOUBLE_N), double_value(value), size(8) { }

        col_t(const char* _name, long value)
        : name(_name), type(LONG_N), long_value(value), size(8) { }
        
        col_t(const char* _name, int value)
        : name(_name), type(INT_N), int_value(value), size(4) { }
        
        col_t(const char* _name, bool value)
        : name(_name), type(BOOLEAN), bool_value(value), size(1) { }
        
        bool operator==(const col_t& cmp_item) {
            return name.compare(cmp_item.name) == 0;
        }
        
        bool operator<(const col_t& cmp_item) {
            return size < cmp_item.size || (size == cmp_item.size && name.compare(cmp_item.name) < 0);
        }
        
        size_t data_size() {
            
            if (type == STRING)
                return size - 4;
            
            return size;
        }
    };
}

#endif
