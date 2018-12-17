//
//  layout.cpp
//  CiPlayground
//
//  Created by Hieu (Jack) Nguyen on 14/12/18.
//  Copyright © 2018 Ambi Studio. All rights reserved.
//

#include "layout.h"

namespace vs {
    
    layout_t::layout_t() : b_end(-1) { };
    
    layout_t::layout_t(std::vector<col_t> _keys, int size)
    : keys(_keys)
    , b_size(size)
//    , buff(block_writer(size))
    {
        int i = 0, pos = MT_BLOCK_START;
        for (auto & itr: keys) {
            
            
            pos += TYPE_SIZE;
            
            itr.set_represent(i);
            itr.set_position(pos);
            descript[itr.name] = &itr;//prop_desc_t{ i, itr.type };
            presenter[i] = itr.name;
            
            if (itr.type == STRING) {
                pos += TYPE_SIZE;
            }
            
            i++;
            pos += itr.size;
        }
        
        b_end = pos;
    }
        
//    void layout_t::build(upair_t* record) {
//
//        buff.set_total_props((int)record->size());
//
//        for (auto itr: keys) {
//            buff.append(itr.represent);
//            (*record)[itr.name]->assign(&buff, itr.size);
////            record.erase(itr.name);
//        };
//
//        for (auto itr: *record) {
//            if (descript.count(itr.first) == 0) {
//                buff.append(itr.second->type);
//                buff.append((int)itr.first.size());
//                buff.append(itr.first.c_str(), (int)itr.first.size());
//                itr.second->assign(&buff);
//            }
//        }
//    }
//
//    void layout_t::write(std::ofstream* writer) {
//        buff.write(writer);
//    }
    
    type_desc_t layout_t::type_of(const char* name) {
        return descript[name]->type;
    }
        
    type_desc_t layout_t::type_of(std::string name) {
        return descript[name]->type;
    }
        
    type_desc_t layout_t::type_of(int present) {
        return keys[present].type;
    }
        
    std::string layout_t::name_of(int present) {
        return keys[present].name;
    }
    
    size_t layout_t::index_of(std::string name) {

        if (descript.count(name) > 0) {
            return descript[name]->position;
        }
        
        return -1;
    }
    
    int layout_t::represent_of(const char *name) {
        return descript[name]->represent;
    }
        
    int layout_t::size() {
        return b_size;
    }
    
    int layout_t::end() {
        return b_end;
    }
    
    size_t layout_t::key_size() {
        return keys.size();
    }
    int layout_t::block_end() {
        return b_end;
    }
}
