
#include "writer_t.h"
#include "../types/col_t.h"
#include "../types/types.h"

namespace vs {

    writer_t::writer_t(const char* _path, desc_t* _desc)
    : path(_path)
    , desc(_desc)
    , b_size(_desc->block_size())
    , r_size(_desc->block_size() - 3)
//    , file(_path, std::ios::binary | std::ios::app)
    {
        
    }
    
    void writer_t::open_conn() {
        file.open(path.c_str(), std::ios::binary | std::ios::app);
        last_block_pos = file.tellp() / b_size;
    }
    
    void writer_t::open_trunc() {
        ffile.open(path.c_str(), std::ios::binary | std::ios::out | std::ios::in);
    }
    
    void writer_t::close_trunc() {
        ffile.close();
    }
    
    writer_t::~writer_t() { }

    size_t writer_t::insert(std::string* buff, row_desc_t row) {
        
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
        
        size_t curr = last_block_pos;
        last_block_pos += 1;
        return curr;
    }

    void writer_t::remove(size_t pos) {
        
        // Move cursor to begin position
        ffile.seekp(b_size * pos + b_size - 2, std::ios::beg);
        
        char buff[1];
        ffile.read(buff, 1);
        
        int num_of_block = buff[0] & 0x1;
        
        ffile.seekp(b_size * pos, std::ios::beg);
        int i = 0;
        char meta[3];
        meta[0] = -1;
        meta[1] = 1;
        
        while (i < num_of_block) {
            // Override record with blank
            ffile.write("", r_size);
            
            meta[2] = (char)i;
            ffile.write(meta, 3);
            i++;
        }
        
//        file.flush();
    }
    
    size_t writer_t::update(size_t pos, std::string* buff, row_desc_t row) {
        
        // TODO
        // If record doesn't fit current pos row
        // remove record and write to end of file
        
        return 0;
    }

    void writer_t::close_conn() {
        file.close();
    }
}
