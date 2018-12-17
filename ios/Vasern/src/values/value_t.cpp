//
//  value_t.cpp
//  CiPlayground
//
//  Created by Hieu (Jack) Nguyen on 11/12/18.
//  Copyright © 2018 Ambi Studio. All rights reserved.
//

#include "value_t.h"

#include "../io/block_writer.h"

namespace vs {

    // ===========
    //  STRING
    // ===========
    
    void value_str::assign(block_writer* stream) {
        
        stream->append(_size);
        stream->append(value.c_str(), _size);
    }
    
    void value_str::assign(block_writer* stream, int len) {
        
        if (len == -1) {
            len = _size;
        }
        stream->append((int)value.size());
        stream->append(value.c_str(), len);
    }
    
    // ===========
    //  NUMBER
    // ===========
    
    void value_number::assign(block_writer* stream) {
        stream->append(value);
    };
    
    void value_number::assign(block_writer* stream, int len) {
        stream->append(value);
    }
    
    
    // ===========
    //  BOOLEAN
    // ===========
    
    void value_bool::assign(vs::block_writer* stream) {
        stream->append(value);
    }
    
    void value_bool::assign(vs::block_writer* stream, int len) {
        stream->append(value);
    }
    
    // ===========
    //  LIST
    // ===========
    
    void value_list::assign(vs::block_writer* stream) {
        
        // Number of items
        stream->append((int)values.size());
        
        for (auto itr: values) {
            
            // Value type
            stream->append((int)itr->type);
            
            // Value
            itr->assign(stream);
        }
    }
    
    void value_list::assign(vs::block_writer* stream, int len) {
        
        // Number of items
        stream->append((int)values.size());
        
        for (auto itr: values) {
            
            // Value type
            stream->append((int)itr->type);
            
            // Value
            itr->assign(stream);
        }
    }
    
    // ===========
    //  OBJECT
    // ===========
    void value_obj::assign(vs::block_writer* stream) {
        
        stream->append((int)values.size());
        
        for (auto itr: values) {
            
            // Value type
            stream->append((int)itr.second->type);
            
            // Property size and value
            stream->append((int)itr.first.size());
            stream->append(itr.first.c_str(), (int)itr.first.size());
            
            // Value
            itr.second->assign(stream);
        }
    }
    
    void value_obj::assign(vs::block_writer* stream, int len) {
        
        stream->append((int)values.size());
        
        for (auto itr: values) {
            
            // Value type
            stream->append((int)itr.second->type);
            
            // Property size and value
            stream->append((int)itr.first.size());
            stream->append(itr.first.c_str(), (int)itr.first.size());
            
            // Value
            itr.second->assign(stream);
        }
    }
}
