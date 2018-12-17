//
//  col_t.hpp
//  CiPlayground
//
//  Created by Hieu (Jack) Nguyen on 14/12/18.
//  Copyright © 2018 Ambi Studio. All rights reserved.
//

#ifndef col_t_hpp
#define col_t_hpp

#include <string>
#include "../types.h"

namespace vs {
    
    class col_t {
    public:
        std::string name;
        type_desc_t type;
        int size;
        int represent;
        int position;
        bool is_key;
        
        col_t(std::string _name, type_desc_t _type);
        col_t(std::string _name, type_desc_t _type, int _size);
        
        void set_position(int value);
        void set_represent(int value);
        void set_size(int value);
        void set_key();
    };
    
    
    typedef std::unordered_map<std::string, col_t*> descript_t;
}

#endif /* col_t_hpp */
