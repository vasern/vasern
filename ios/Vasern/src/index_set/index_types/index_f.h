//
//  index_f.h
//  Vasern
//
//  Created by Hieu (Jack) Nguyen on 26/11/18.
//  Copyright © 2018 Hieu (Jack) Nguyen. All rights reserved.
//

#ifndef index_f_h
#define index_f_h

#include "../../enums.h"

#include "index_str.h"
#include "index_number.h"
#include "index_bool.h"

namespace vs {
    
    class index_f {
    public:
        static index_t* create(type_desc_t type) {
            
            index_t* t;
            
            switch(type) {
                case STRING:
                case KEY:
                    t = new index_str();
                    break;
                case NUMBER:
                    t = new index_number();
                    break;
                case BOOLEAN:
                    t = new index_bool();
                    break;
                default:
                    t = new index_t();
                    break;
            }
            
            return t;
        }
    };
}

#endif /* index_f_h */
