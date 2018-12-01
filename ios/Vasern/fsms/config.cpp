//
//  config.cpp
//  Vasern
//
//  Created by Hieu (Jack) Nguyen on 23/11/18.
//  Copyright © 2018 Hieu (Jack) Nguyen. All rights reserved.
//

#include "config.h"

namespace vs {
    
    desc_t META_DESC({
        col_key_t("collection", ""),
        col_str_t("desc", "", 100),
        {
            new col_long_t("block_size", 0),
            new col_long_t("v_block_size", 0),
            new col_int_t("version", 0),
            new col_str_t("id", "", 20),
            new col_str_t("indexes", "", 255),
        },
        1
    });
}
