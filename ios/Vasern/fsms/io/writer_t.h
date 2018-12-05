
#ifndef write_t_h
#define write_t_h

#include <fstream>
#include <string>
#include "../types/desc_t.h"
#include "../types/types.h"

namespace vs {

    class writer_t {
    public:

        writer_t(const char* path, desc_t* desc);
        ~writer_t();
        
        size_t insert(std::string* buff, row_desc_t row);
        void remove(size_t pos);
        size_t update(size_t pos, std::string* buff, row_desc_t row);
        
        void open_trunc();
        void close_trunc();
        void open_conn();
        void close_conn();

    private:
        
        desc_t* desc;
        size_t b_size;
        size_t r_size;
        size_t last_block_pos;
        
        std::ofstream file;
        std::fstream ffile;
        std::string path;
    };

}

#endif
