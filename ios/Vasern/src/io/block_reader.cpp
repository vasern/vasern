//
//  br_stream.cpp
//  CiPlayground
//
//  Created by Hieu (Jack) Nguyen on 11/12/18.
//  Copyright © 2018 Ambi Studio. All rights reserved.
//

#include "block_reader.h"
#include "block_helper.h"
#include "block_config.h"
#include "../values/value_f.h"

namespace vs {
    
    block_reader::block_reader(size_t _begin, size_t _len, char* _fmap, layout_t *_layout)
    : begin(_begin)
    , fmap(_fmap)
    , layout(_layout)
    , flen(_len)
    { }
    
    // ===========
    //  DATA EXTRACTORs
    // ===========
    
    // Load then return key and indexes
    upair_t block_reader::tags() {
        upair_t rs;
        
        size_t pos;
        
        for (auto itr: layout->keys) {
            
            pos = begin + itr.position;
            switch (itr.type) {
                    
                case STRING:
                    
                    rs[itr.name] = block_helper::get_str(&pos, fmap);
                    break;
                    
                case NUMBER:
                    
                    rs[itr.name] = block_helper::get_number(pos, fmap);
                    break;
                    
                case BOOLEAN:
                    
                    rs[itr.name] = block_helper::get_bool(pos, fmap);
                    break;
                    
                default:
                    break;
            }
        }
        
        return rs;
    }
    
    // Load then return all properties and values
    upair_t block_reader::object() {
        upair_t rs = tags();
        
        size_t pos = begin + layout->block_end();
        int total_props = fmap[begin + MT_TOTAL_PROPS] & 0xff;
        int i = (int)rs.size(), type, size;
        ulist_t props;
        type_desc_t ptype;
        char* prop;
        
        while (i++ < total_props) {
            type = fmap[pos] & 0xf;
            pos += TYPE_SIZE;
            
            size = fmap[pos] & 0xf;
            pos += TYPE_SIZE;
            
            ptype = static_cast<type_desc_t>(type);
            prop = new char[size];
            block_helper::read_str(pos, size, fmap, prop);
            pos += size;
            
            switch (ptype) {
                    
                case STRING:
                    
                    rs[prop] = block_helper::get_str(&pos, fmap);
                    break;
                    
                case NUMBER:
                    
                    rs[prop] = block_helper::get_number(pos, fmap);
                    pos += NUMBER_SIZE;
                    
                    break;
                    
                case BOOLEAN:
                    
                    rs[prop] = block_helper::get_bool(pos, fmap);
                    pos += BOOL_SIZE;
                    break;
                    
                case OBJECT: {
                    
                    upair_t ob;
                    size = (int)(fmap[pos] & 0xff);
                    pos += TYPE_SIZE;
                    
                    block_helper::read_obj(&ob, &pos, size, fmap);
                    rs[prop] = value_f::create(ob);
                    break;
                }
                case LIST: {
                    
                    ulist_t list;
                    size = (int)(fmap[pos] & 0xff);
                    pos += TYPE_SIZE;
                    
                    block_helper::read_list(&list, &pos, size, fmap);
                    rs[prop] = value_f::create(list);
                    
                    break;
                }
                default:
                    break;
            }
            
            
            delete[] prop;
        }
        
        return rs;
    }
    
    // Load and return only properties that match `props`
    upair_t block_reader::get(std::vector<std::string> props) {
        upair_t rs;
        
        return rs;
    }
    
    
    // ===========
    //  NAVIGATORs
    // ===========
    
    void block_reader::next() {
        int b_s = layout->size() * (int)(fmap[begin] & 0xff);
        begin += b_s;
    }
    
    void block_reader::prev() {
        begin -= layout->size() * (fmap[begin] & 0xff);
    }
    
    block_reader* block_reader::next_ptr() {
        return new block_reader(begin + layout->size()  * (fmap[begin] & 0xff), flen, fmap, layout);
    }
    
    block_reader* block_reader::prev_ptr() {
        return new block_reader(begin - layout->size() * (fmap[begin] & 0xff), flen, fmap, layout);
    }
    
    // ===========
    //  UTILS
    // ===========
    
    int block_reader::total_blocks() {
        return fmap[begin] & 0xff;
    }
    
    bool block_reader::is_valid() {
        return begin < flen && (fmap[begin] & 0xff) != 0;
    }
    
    bool block_reader::is_tombstone() {
        return (fmap[begin + MT_TOTAL_PROPS] & 0xff) == 0;
    }
}
