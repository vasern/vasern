
#ifndef col_t_h
#define col_t_h

#include "enums.h"
#include <string>

namespace vs {

    class col_t {
    
    public:
        
        prop_desc_t type;
        std::string name;
        
        col_t() {};
        col_t(const char* _name, prop_desc_t _type): name(_name), type(_type) {};
        
        virtual size_t size() { return 0; };
        virtual const char* c_str() { return ""; };
        
        size_t block_size() { return 0; };
        
        virtual void set(const char*) { };
        virtual void set(double) { };
        virtual void set(int) { };
        virtual void set(bool) { };
        virtual void set(long) { };
    };
}

#endif
