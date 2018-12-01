//
//  index_item.hpp
//  Vasern
//
//  Created by Hieu (Jack) Nguyen on 18/11/18.
//  Copyright © 2018 Hieu (Jack) Nguyen. All rights reserved.
//

#ifndef index_item_hpp
#define index_item_hpp

#include <string>
#include <vector>
#include "iitem_types.h"

namespace vs {
    
    
    // Index Item
    class iitem_t {
    public:
        const int offset;
        
        iitem_t(int _offset, int prop_len)
        : offset(_offset)
        { }
        
        
        int get_offset() {
            return _offset;
        }
        
    private:
        int _offset;
        std::vector<iprop_t> _props;
    };
}

#endif /* index_item_hpp */
