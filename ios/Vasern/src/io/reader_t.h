
#ifndef reader_t_h
#define reader_t_h

#include "../types.h"
#include "block_reader.h"
#include <string>

namespace vs {

    class reader_t {
    public:
        reader_t(const char* path, layout_t* layout);

        block_reader get(size_t pos);
        
        block_reader* get_ptr(size_t pos);
        
        void open_conn();
        void close_conn();
        
        size_t size();
        
        bool is_open();
        
    private:

//        descript_t* prop_desc;
//        block_desc_t* desc;
        layout_t* layout;
        
        size_t f_size;
        int fd;
        char* fmap;

        std::string path;
        bool opening;
    };

}

#endif
