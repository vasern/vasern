//
//  block_write_stream.hpp
//  CiPlayground
//
//  Created by Hieu (Jack) Nguyen on 11/12/18.
//  Copyright © 2018 Ambi Studio. All rights reserved.
//

#ifndef block_writer_h
#define block_writer_h

#include <string.h>
#include <fstream>
#include <unordered_map>

#include "../types.h"

namespace vs
{
    class block_writer {
    public:
        
        block_writer(int block_size);
        ~block_writer();
        
        // Assign value of `buff` into
        // a specific position of buffer
        void assign(char* buff, int position, int len);
        
        
        // Append value of `buff` into buffer
        // (automatically push_block() if len > free_size)
        void append(const char* buff, int len); // ideally for string only (not good for casted numbers)
        void append(double value);         // ideally for numbers
        void append(int value);                 // ideally for type
        void append(bool value);
        
        // Clear buffer
        void clear();
        
        // Write buffer to ostream
        void write(std::ofstream* writer);
        
        // Return block size
        int size();
        int num_of_blocks();
        
        // Return the size of free block space
        int free_size();
        
        void set_total_props(int);
        
    private:
        
        void push_block();
        void build_meta();
        
        char* buff;
        
        int pos;
        int b_size;
        
        short int total_blocks;
        short int total_props;
    };
    
    
} // vs

#endif /* block_writerpp */
