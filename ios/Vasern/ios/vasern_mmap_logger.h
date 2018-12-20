//================================================================
//
//  Copyright by Ambi Studio 2018
//  Licensed under the Apache License, Version 2.0 (the "License");
//  (Please find "LICENSE" file attached for license details)
//================================================================

#ifndef __VASERN_LOGGER_HEADER__
#define __VASERN_LOGGER_HEADER__

#import <Foundation/Foundation.h>
#import <fstream>

namespace vasern {
    
    class Storage {
        
    public:
        Storage();
        
        // In-memory storage
        // Data loaded will be store in this variable, and to be used in the js side
        NSMutableDictionary<NSString*, NSArray*> *tStore;
        
        // Log file dir location
        NSString *rootPath;
        NSString *docPath;
        NSString *metaPath;
        NSMutableArray<NSString *> *docs;
        
        bool ready;
        
        // Validate Storage dir location, if dir not exist, create one
        // return 'false' if new dir is created
        bool CreateDir();
        
        // Load info
        void Init();
        
        // Insert will write records into the log file
        // doc: document name
        // records: transaction log records
        // cleanMode: set to 'true' to overide existing log with a clean log (no remove, duplicate records)
        bool Insert(const char *doc, NSArray *chunk, bool cleanMode = false);
        
        // Load records from log file
        // return as a list of records
        NSArray* Load(const char *doc);
        
        // !!! Use with caution
        // Remove all records within document
        void ClearDocument(const char *doc);
        
    private:
        
        // get_doc_path will return doc file location using doc's name
        const char* get_doc_path(const char*doc);
        
        NSArray* load_file_contents(const char* fileName);
        
        size_t file_size(const char* doc);
        
        void check_document_exists(NSString* doc);
        
        bool write_to_file(const char *filePath, size_t size, const char* data, std::ios_base::openmode mode);
        
    }; // class Storage
};


#endif
