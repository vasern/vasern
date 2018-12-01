//
//  desc_t.h
//  fsms
//
//  Created by Hieu (Jack) Nguyen on 22/11/18.
//  Copyright © 2018 Ambi Studio. All rights reserved.
//

#ifndef desc_t_h
#define desc_t_h

#include "col_types.h"
#include <unordered_map>
#include <string>
#include <fstream>
#include <vector>

namespace vs {
    
    struct row_desc_t {
        col_key_t key;
        col_str_t value;
        std::vector<col_t*> indexes;
    };
    
    class desc_t {
    
    public:
        
        int version;
        col_key_t key;
        col_str_t value;
        std::vector<col_t*> indexes;
        
        desc_t();
        desc_t(col_key_t _key, col_str_t _value, std::vector<col_t*> _indexes, int _version);
        
        size_t position_of(const char* name);
        size_t block_size();
        size_t size_of(const char* name);
        
        std::string key_str();
        std::string value_str();
        std::string indexes_str();
        
        static col_t* create_col(prop_desc_t type, const char* name, size_t size);
        static col_t* create_col(const char* type, const char* name, size_t size);
    private:
        
        size_t b_size;
        
        // Calculated position of key, indexes and avalue
        // for quick record acess
        std::unordered_map<std::string, size_t> _position;
        std::unordered_map<std::string, size_t> _size;
        
        void calculate_position();
        
    };
}

#endif /* desc_t_h */
