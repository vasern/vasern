//================================================================
//
//  Copyright by Ambi Studio 2018
//  Licensed under the Apache License, Version 2.0 (the "License");
//  (Please find "LICENSE" file attached for license details)
//================================================================

#import <Foundation/Foundation.h>
#import "VasernManager.h"
#import "vasern_mmap_logger.h"
#import <string>
#import <vector>


vasern::Storage db = vasern::Storage();


@implementation VasernManager
RCT_EXPORT_MODULE();

// Insert log records into log file
RCT_EXPORT_METHOD(Insert: (NSString *)doc data:(NSArray *)data options:(NSArray *)options
		storeWithResolver:(RCTPromiseResolveBlock)resolve
		rejecter:(RCTPromiseRejectBlock)reject)
{
    
	bool success = db.Insert(
		[doc UTF8String],
		data,
		[options containsObject: @"enable_clean_mode"]
	);
	
	if (success) {
		resolve(@{ @"status" : [NSNumber numberWithInt: 200] });
	} else {
		reject(@"404", @"Unable to write data", nil);
	}
}

// Load log file and return an array of log records
RCT_EXPORT_METHOD(Load: (NSString *)doc
	storeWithResolver:(RCTPromiseResolveBlock)resolve
	rejecter:(RCTPromiseRejectBlock)reject)
{
    resolve(@{ @"data": db.Load([doc UTF8String]) });
}

// Load log file and return an array of log records
RCT_EXPORT_METHOD(Request: (NSString *)doc
                  storeWithResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    NSArray *records;
    
    if (db.tStore[doc])
        records = db.tStore[doc];
    else
        records = [NSArray new];
    
    resolve(@{ @"data": records });
}

@end

