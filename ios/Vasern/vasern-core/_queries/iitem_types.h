//
//  iitem_types.h
//  Vasern
//
//  Created by Hieu (Jack) Nguyen on 25/11/18.
//  Copyright © 2018 Hieu (Jack) Nguyen. All rights reserved.
//

#ifndef iitem_types_h
#define iitem_types_h

namespace vs {
    
    // Base index prop type
    class iprop_t {
    public:
        std::string str_val();
        int int_val();
    };
    
    // Number index prop type
    class iprop_number : iprop_t {
    public:
        
        iprop_number(int number)
        : value(number)
        { }
        
        int int_val() {
            return value;
        }
        
    private:
        int value;
    };
    
    // String index Prop type
    class iprop_str : iprop_t {
    public:
        
        iprop_str(std::string str)
        : value(str)
        { }
        
        std::string str_value() {
            return value;
        }
        
    private:
        std::string value;
        
    };
    
}

#endif /* iitem_types_h */
