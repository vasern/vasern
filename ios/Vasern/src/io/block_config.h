//
//  block_config.h
//  CiPlayground
//
//  Created by Hieu (Jack) Nguyen on 11/12/18.
//  Copyright © 2018 Ambi Studio. All rights reserved.
//

#ifndef block_config_h
#define block_config_h

namespace vs {
    
    enum configs {
        NUMBER_SIZE = 8,
        BOOL_SIZE = 1,
        TYPE_SIZE = 1,
        
        MT_SIZE = 11, // 5 at begining, 1 at the end
        MT_BLOCK_START = 10, // block content start at 6th position
        MT_TOTAL_PROPS = 1, // meta: position of total number of properties
        MT_TOTAL_BLOCK = 0, // meta: position of total number of blocks
        
    };
}


#endif /* block_config_h */
