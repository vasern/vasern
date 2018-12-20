//================================================================
//
//  Copyright by Ambi Studio 2018
//  Licensed under the Apache License, Version 2.0 (the "License");
//  (Please find "LICENSE" file attached for license details)
//================================================================


#include "vasern_mmap_logger.h"
#include "vasern_utils.h"
#include "config.h"

#include <sys/stat.h>
#include <algorithm>
#include <fstream>

// mmap
#include <sys/mman.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>
#include <assert.h>

namespace vasern
{
    
    Storage::Storage()
    : ready(false)
    {
        
        // Create dir if not exist
        CreateDir();
        
        // Load info
        Init();
    }
    
    void Storage::Init() {
        
        metaPath = [NSString stringWithFormat:@"%@/%s", rootPath, "meta.vasern"];
        docs = [NSMutableArray arrayWithArray:load_file_contents([metaPath UTF8String])];
        tStore = [NSMutableDictionary new];
        
        for (NSString *docname in docs) {
            [tStore setObject:Load([docname UTF8String]) forKey:docname];
        }
        
        ready = true;
    }
    
    bool Storage::CreateDir()
    {
        // Get and assign "/Documents" dir
        NSArray *pathArray = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
        rootPath = [pathArray objectAtIndex:0];
        
        NSString *newDir = [rootPath stringByAppendingFormat:@"/%s", DOC_DIR];
        
        NSError * error = nil;
        [[NSFileManager defaultManager] createDirectoryAtPath:newDir
                                  withIntermediateDirectories:YES
                                                   attributes:nil
                                                        error:&error];
        if (error != nil) {
            
            //..
            docPath = rootPath;
            return false;
        }
        
        docPath = newDir;
        return true;
    }
    
    //  Records are separated by a line break "\n"
    //  In case your records contain line break, try to espace line break
    //  by replacing "\n" with something like "\u00A0n"
    bool Storage::Insert(const char *docname, NSArray *chunk, bool cleanMode)
    {
        NSString *doc = [NSString stringWithUTF8String:docname];
        
        check_document_exists(doc);
        const char* filePath = [[NSString stringWithFormat:@"%@/%@%s", docPath, doc, DOC_EXT] UTF8String];
        
        std::string data = NSArrayToStr(chunk);
        
        std::ofstream db;
        
        if (cleanMode)
        {
            
            // Overide existing log data with a clean log data
            db = std::ofstream(filePath, std::ios::binary);
        } else {
            // Open file in appending mode
            db = std::ofstream(filePath, std::ios::binary | std::ios::app);
        }
        
        if (db.is_open())
        {
            
            // Write records
            db.write(data.data(), data.size());
            db.close();
            
            // Append new inputs to current input list
            [tStore setObject:[[tStore valueForKey:doc]
                     arrayByAddingObjectsFromArray:chunk]
                       forKey:doc];
            
            return true;
        }
        
        // File not open, something went wrong
        return false;
    }
    
    void Storage::ClearDocument(const char *doc) {
        const char* filePath = [[NSString stringWithFormat:@"%@/%s%s", docPath, doc, DOC_EXT] UTF8String];
        std::ofstream db(filePath, std::ios::binary);
        db.write("", 0);
    }
    
    //  In case you have escaped your record by replacing line breaks (\n)
    //  with something else (like \u00A0n) as mention at Storage::Insert
    //  remember to de-escape those replaced line breaks
    NSArray* Storage::Load(const char* doc)
    {
        doc = get_doc_path(doc);
        return load_file_contents(doc);
    }
    
//    =============
//    Priviate area
//    =============
    NSArray* Storage::load_file_contents(const char* filePath) {
        
        NSMutableArray *results = [NSMutableArray new];
        size_t fsize = file_size(filePath);
        
        int fd = open(filePath, O_RDONLY);
        
        if(fd != -1) {
            
            char *content = (char *)mmap(NULL, fsize, PROT_READ, MAP_SHARED, fd, 0);
            
            // Check map failed/file not exits/file empty
            if(content != MAP_FAILED) {
                char *running = strdup(content);
                char *token = strsep(&running, LINE_BREAK);
                
                NSString *tempObj = [NSString new];
                while (token)
                {
                    tempObj = [NSString stringWithUTF8String: token];
                    if (tempObj.length > 0) {
                        [results addObject:tempObj];
                    }
                    
                    token = strsep(&running, LINE_BREAK);
                }
            }
        }
        close(fd);
        
        return results;
    }
    
    const char* Storage::get_doc_path(const char* doc)
    {
        return [[NSString stringWithFormat:@"%@/%s/%s%s", rootPath, DOC_DIR, doc, DOC_EXT] UTF8String];
    }
    
    size_t Storage::file_size(const char *filePath)
    {
        
        struct stat st;
        stat(filePath, &st);
        
        return st.st_size;
    }
    
    void Storage::check_document_exists(NSString *docname) {
        auto found = [docs indexOfObject:docname];
        if (found == NSNotFound) {
            // document not exsits,
            
            // append to doc list
            [docs addObject: docname];
            tStore[docname] = [NSArray new];
            
            // append to info
            docname = [docname stringByAppendingFormat:@"%s", LINE_BREAK];
            
            write_to_file([metaPath UTF8String], [docname length], [docname UTF8String], std::ios::binary | std::ios::app);
        };
    }
    
    bool Storage::write_to_file(const char *filePath, size_t size, const char* data, std::ios_base::openmode mode)
    {

        auto file = std::ofstream(filePath, mode);
        if (file.is_open())
        {
            
            // Write records
            file.write(data, size);
            file.close();
            
            return true;
        }
        
        // File not open, something went wrong
        return false;
    }
} // namespace vasern
