
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
        
        size_t update(size_t pos, upair_t* row);
        size_t insert(std::string* buff, upair_t row);
        void remove(size_t pos);
        
        void open_trunc();
        void open_conn();
        void close_conn();
        
        void build(upair_t* record);
        size_t write();
        void remove_all();
        
    private:
        
        layout_t *layout;
        block_writer buff;
        
        size_t last_block_pos;
        
        std::fstream file;
        std::string path;
    };

}

#endif
