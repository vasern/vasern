//
//  col_t.cpp
//  CiPlayground
//
//  Created by Hieu (Jack) Nguyen on 14/12/18.
//  Copyright © 2018 Ambi Studio. All rights reserved.
//

#include "col_t.h"
#include "../io/block_config.h"

namespace vs {
    
    col_t::col_t(std::string _name, type_desc_t _type)
    : name(_name)
    , type(_type)
    , represent(0)
    , is_key(false)
    , position(0)
    {
        switch (_type) {
            case STRING:
                size = -1;
                break;
            case NUMBER:
                size = NUMBER_SIZE;
                break;
            case BOOLEAN:
                size = BOOL_SIZE;
                break;
            default:
                // OBJECT and LIST used its own size
                break;
        }
    }
    
    col_t::col_t(std::string _name, type_desc_t _type, int _size)
    : name(_name)
    , type(_type)
    , size(_size)
    , represent(0)
    , is_key(false)
    , position(0)
    {
        
    }
    
    void col_t::set_size(int value) {
        size = value;
    }
    
    void col_t::set_position(int value) {
        position = value;
    }
    
    void col_t::set_represent(int value) {
        represent = value;
    }
    
    void col_t::set_key() {
        is_key = true;
    }
}
