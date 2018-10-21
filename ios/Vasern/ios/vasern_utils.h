//
//  vasern_utils.h
//  Vasern
//
//  Created by Hieu (Jack) Nguyen on 11/10/18.
//  Copyright © 2018 Hieu (Jack) Nguyen. All rights reserved.
//

#ifndef vasern_utils_h
#define vasern_utils_h

#import <Foundation/Foundation.h>
#import <string>
#import <vector>

namespace vasern {
    
// Convert a NSArray (objective-c) to vector<string> (cpp)
std::string NSArrayToStr(NSArray* input);

// Convert a vector<string> (cpp) to NSArray (objective-c)
NSArray* VectorStrToNSArray(std::vector<char*> *input);

}


#endif /* vasern_utils_h */
