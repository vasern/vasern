
#ifndef record_t_h
#define record_t_h

#include "desc_t.h"
#include <string>

namespace vs {

    class record_t {
    public:
        
        record_t(char* map_add, size_t begin_pos, desc_t* _desc);
        record_t();
        
        std::string key();
        std::string value();
        
        void get_value(char* buff, size_t start, size_t end);
        
        bool bool_value(const char* name);
        std::string str_value(const char* name);
        int int_value(const char* name);
        long long_value(const char* name);
        double double_value(const char* name);

        bool valid();
        
        // Get next record_t
        record_t* next_ptr();
        
        // Get previous record_t
        record_t* prev_ptr();
        
        int total_blocks();
        
    private:
        
        // Calculate start position using desc index and size
        size_t value_start_pos(const char* name);

        // mmap file pointer
        char* map;
        desc_t* desc;

        size_t beg;
        size_t b_size;
    };
}

#endif
