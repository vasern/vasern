
#ifndef reader_t_h
#define reader_t_h

#include "../types/desc_t.h"
#include "record_t.h"
#include <string>

namespace vs {

    class reader_t {
    public:
        reader_t(const char* path, desc_t* desc);

        record_t get(size_t pos);
        
        record_t* get_ptr(size_t pos);
        
        void open_conn();
        void close_conn();
        
        size_t size();
        
        bool is_open();
        
    private:

        desc_t* desc;

        size_t f_size;
        int fd;
        char* fmap;

        size_t b_size;
        std::string path;
        bool opening;
    };

}

#endif
