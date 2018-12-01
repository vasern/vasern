
#include "record_t.h"

namespace vs {

    record_t::record_t(char* map_add, size_t begin_pos, desc_t* _desc)
    : map(map_add)
    , beg(begin_pos)
    , b_size(_desc->block_size())
    , desc(_desc)
    { }
    
    record_t::record_t() { }
        
    bool record_t::bool_value(const char* _name) {
        return (bool&)map[beg + desc->position_of(_name)];
    }
    
    std::string record_t::key()  {
        
        char buff[desc->key.size()];
        size_t buff_pos = 0;
        size_t map_pos = beg;
        while (buff_pos < desc->key.size()) {
            buff[buff_pos++] = map[map_pos++];
        }
        buff[buff_pos] = '\0';
        return std::string(buff);
    }
    
    std::string record_t::value()  {

        int num_of_blocks = map[beg + b_size - 2] & 0xf;
        
        size_t value_start_pos = desc->position_of("value");
        size_t buff_pos = 0, map_pos;
        size_t block_start_pos = beg + value_start_pos;
        
        char buff[num_of_blocks * desc->block_size() - value_start_pos];
        
        for (int i = 0; i < num_of_blocks; i++) {
            map_pos = block_start_pos;
            while(map[map_pos] != '\0') {
                buff[buff_pos++] = map[map_pos++];
            }
            block_start_pos += desc->block_size();
        }
        
        buff[buff_pos] = '\0';
        return std::string(buff);
    }

    std::string record_t::str_value(const char* _name) {
        
        size_t size = desc->size_of(_name);
        size_t buff_pos = 0;
        size_t map_pos = beg + desc->position_of(_name);
        
        char buff[size];
        
        while (map[map_pos] != '\0' && buff_pos < size) {
            buff[buff_pos++] = map[map_pos++];
        }
        
        buff[buff_pos] = '\0';
        return std::string(buff);
    }
    
    int record_t::int_value(const char* _name) {
        return (int&)map[beg + desc->position_of(_name)];
    }
    
    long record_t::long_value(const char* _name) {
        return (long&)map[beg + desc->position_of(_name)];
    }
    
    double record_t::double_value(const char* _name) {
        return (double&)map[beg + desc->position_of(_name)];
    }

    bool record_t::valid() {
        return map != NULL &&
            (map[beg + b_size - 2] & 0xf) > 0;
    }
    
    // Get next record_t
    record_t* record_t::next_ptr() {
        return new record_t(map, beg + b_size, desc);
    }
    
    // Get previous record_t
    record_t* record_t::prev_ptr() {
        size_t prev_beg = beg -
        (map[beg - 2] & 0xff * b_size);
        return new record_t(map, prev_beg, desc);
    }
    
    int record_t::total_blocks() {
        return 1; //map[beg + b_size - 2] & 0xf;
    }
}
