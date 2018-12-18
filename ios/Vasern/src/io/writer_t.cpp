
#include "writer_t.h"

namespace vs {

    writer_t::writer_t(const char* _path, layout_t *_layout)
    : path(_path)
    , layout(_layout)
    , buff(block_writer(_layout->size()))
    {}
    
    void writer_t::open_conn() {
        file.open(path.c_str(), std::ios::binary | std::ios::app);
    
        last_block_pos = file.tellp() / layout->size();
    }
    
    void writer_t::open_trunc() {
        ffile.open(path.c_str(), std::ios::binary | std::ios::out | std::ios::in);
    }
    
    void writer_t::close_trunc() {
        ffile.close();
    }
    
    writer_t::~writer_t() { }

    size_t writer_t::insert(std::string* buff, upair_t row) {
        
        return 10;
    }
    
    void writer_t::build(upair_t* record) {
        
        buff.set_total_props((int)record->size());

        for (auto itr: layout->keys) {
            buff.append(itr.represent);
            (*record)[itr.name]->assign(&buff, itr.size);
        };
        
        std::vector<std::string> remove_keys;
        for (auto itr: *record) {
            if (layout->descript.count(itr.first) == 0) {
                buff.append((int)itr.second->type);
                buff.append((int)itr.first.size());
                buff.append(itr.first.c_str(), (int)itr.first.size());
                itr.second->assign(&buff);
//                record->erase(itr.first);
                remove_keys.push_back(itr.first);
            }
        }
        
        for (std::string key: remove_keys) {
            record->erase(key);
        }
    }

    size_t writer_t::write() {
        size_t pos = last_block_pos;
        last_block_pos += buff.num_of_blocks();
        buff.write(&file);
        return pos;
    }
    
//    block_writer writer_t::build(upair_t record) {
//
//        block_writer block(layout->size());
//
//        block.set_total_props((int)record.size());
//
//        for (auto itr: record) {
//            block.append(layout->represent_of(itr.first.c_str()));
//            itr.second->assign(&block);
//        }
//
//        return block;
//    }
//
//    void writer_t::build(block_writer* buff, upair_t* record) {
//
//
//        buff->set_total_props((int)record->size());
//
//        for (auto itr: *record) {
//            buff->append(layout->represent_of(itr.first.c_str()));
//            itr.second->assign(buff);
//        }
//    }

    void writer_t::remove(size_t pos) {
        
        // Move cursor to begin position
        ffile.seekp(layout->size() * pos, std::ios::beg);
        
        char temp_buff[1];
        ffile.read(temp_buff, 1);
        
        int num_of_block = temp_buff[0] & 0xff;
        
        buff.remove(&ffile, layout->size() * pos, num_of_block);
        
    }
    
    size_t writer_t::update(size_t pos, std::string* buff, upair_t row) {
        
        // TODO
        // If record doesn't fit current pos row
        // remove record and write to end of file
        
        return 0;
    }

    void writer_t::close_conn() {
        file.close();
    }
}
