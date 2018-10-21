//================================================================
//
//  Copyright by Ambi Studio 2018
//  Licensed under the Apache License, Version 2.0 (the "License");
//  (Please find "LICENSE" file attached for license details)
//================================================================


#include "vasern_utils.h"
#include "config.h"


namespace vasern {

// Convert a NSArray (objective-c) to vector<string> (cpp)
std::string NSArrayToStr(NSArray* input) {
    
    std::string output = "";
    for (id obj in input) {
        output.append([obj UTF8String]);
        output.append(LINE_BREAK);
    }
    
    return output;
}

// Convert a vector<string> (cpp) to NSArray (objective-c)
NSArray* VectorStrToNSArray(std::vector<char*> *input) {
    
	NSMutableArray *output = [NSMutableArray arrayWithCapacity:input->size()];
	for (int i = 0; i < input->size(); i++) {
		[output addObject:[NSString stringWithUTF8String: input->at(i) ]];
	}
    
	return output;
}

// Merge 2 NSArray
NSArray* MergeNSArrays(NSArray *source, NSArray *input) {
    NSMutableArray *result = [NSMutableArray arrayWithArray:source];
    [result addObjectsFromArray:input];
    
    return result;
}
    
} // namespace vasern
