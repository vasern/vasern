//
//  block_helper.hpp
//  CiPlayground
//
//  Created by Hieu (Jack) Nguyen on 12/12/18.
//  Copyright © 2018 Ambi Studio. All rights reserved.
//

#ifndef block_helper_hpp
#define block_helper_hpp

#include <vector>
#include <string>
#include <unordered_map>

#include "../types.h"
namespace vs {
    
    class block_helper {
    public:
        static void read_obj(upair_t *rs,
                             size_t *pos,
                             int num_of_props,
                             char* fmap);
        
        static void read_list(std::vector<value_t*>* rs,
                              size_t *pos,
                              int num_of_items,
                              char* fmap);
        
        static void read_str(size_t pos, int len, char* fmap, char* buff);
        static value_t* get_str(size_t* pos, char* fmap);
        static value_t* get_bool(size_t pos, char* fmap);
        static value_t* get_number(size_t pos, char* fmap);
    };
}

#endif /* block_helper_hpp */
