
#ifndef write_t_h
#define write_t_h

#include <fstream>
#include <string>
#include "../types.h"
#include "../layout.h"

#include "block_writer.h"

namespace vs {

    class writer_t {
    public:

        writer_t(const char* path, layout_t *layout);
        ~writer_t();
        
        size_t insert(std::string* buff, upair_t row);
        void remove(size_t pos);
        size_t update(size_t pos, std::string* buff, upair_t row);
        
        void open_trunc();
        void close_trunc();
        void open_conn();
        void close_conn();
        
        void build(upair_t* record);
        size_t write();
        
    private:
        
        layout_t *layout;
        block_writer buff;
        
        size_t last_block_pos;
        
        std::ofstream file;
        std::fstream ffile;
        std::string path;
    };

}

#endif
