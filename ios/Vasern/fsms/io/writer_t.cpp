
#include "writer_t.h"
#include "../types/col_t.h"

namespace vs {

    writer_t::writer_t(const char* _path, desc_t* _desc)
    : path(_path)
    , desc(_desc)
    , b_size(_desc->block_size())
    , r_size(_desc->block_size() - 3)
    , file(_path, std::ios::binary | std::ios::app) { }
    
    writer_t::~writer_t() { }

    void writer_t::insert(std::string* buff, row_desc_t row) {
        
        size_t pos = 0;
        file.write(row.key.c_str(), desc->key.size());
        pos += desc->key.size();
        for (auto itr : row.indexes) {
           file.write(itr->c_str(), desc->size_of(itr->name.c_str()));
            pos += desc->size_of(itr->name.c_str());
        }
        
        file.write(row.value.c_str(), r_size - desc->position_of("value"));
        pos += r_size - desc->position_of("value");

        char meta[3];
        meta[0] = '\0';
        meta[1] = 1;
        meta[2] = '0';
        file.write(meta, 3);
        
    }

    void writer_t::remove(const char* key) {
        // TODO: find out block position and override with \0
    }

    void writer_t::close_conn() {
        file.close();
    }
}
