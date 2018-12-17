//
//  layout.h
//  CiPlayground
//
//  Created by Hieu (Jack) Nguyen on 14/12/18.
//  Copyright © 2018 Ambi Studio. All rights reserved.
//

#ifndef layout_h
#define layout_h

#include "types.h"
#include "enums.h"
#include "values/col_t.h"

#include "io/block_writer.h"
#include "io/block_config.h"

namespace vs {
    
    typedef std::vector<col_t> schema_t;
    
    class layout_t {
    public:
        
        layout_t();
        layout_t(schema_t _keys, int size);
        
//        void build(upair_t* record);
//
//        void write(std::ofstream* writer);
        
        type_desc_t type_of(const char* name);
        type_desc_t type_of(std::string name);
        type_desc_t type_of(int present);
        
        std::string name_of(int present);
        size_t index_of(std::string name);
        int represent_of(const char* name);
        
        int size();
        int end();
        size_t key_size();
        int block_end();
        
        schema_t keys;
        descript_t descript;
        
    private:
        
        int b_end;
        int b_size;
        std::unordered_map<int, std::string> presenter;
    };
    
    
}


#endif /* layout_h */
