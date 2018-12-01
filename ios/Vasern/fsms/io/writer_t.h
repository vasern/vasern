
#ifndef write_t_h
#define write_t_h

#include <fstream>
#include <string>
#include "../types/desc_t.h"

namespace vs {

    class writer_t {
    public:

        writer_t(const char* path, desc_t* desc);
        ~writer_t();
        
        void insert(std::string* buff, row_desc_t row);
        void remove(const char* key);

        // void open_conn();

        void close_conn();

    private:
        
        desc_t* desc;
        size_t b_size;
        size_t r_size;
        
        std::ofstream file;
        std::string path;
    };

}

#endif
