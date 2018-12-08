
#include "reader_t.h"

#include <sys/mman.h>
#include <fcntl.h>
#include <unistd.h>

namespace vs {

    reader_t::reader_t(const char* _path, desc_t* _desc)
    : path(_path), desc(_desc), b_size(_desc->block_size()), opening(false) {
        open_conn();
    }
    
    size_t reader_t::size() {
        return f_size;
    }
    
    record_t reader_t::get(size_t pos) {
        size_t beg = pos * desc->block_size();
        if (beg < f_size) {
            return record_t(fmap, beg, desc);
        }
        return record_t();
    }
    
    record_t* reader_t::get_ptr(size_t pos) {
        size_t beg = pos * b_size;
        if (beg < f_size) {
            return new record_t(fmap, beg, desc);
        }
        return NULL;
    }

    void reader_t::open_conn() {
        fd = open(path.c_str(), O_RDONLY, (mode_t)0600);
            
        // mmap file start to end (allows null chars)
        off_t pos = lseek(fd, 0, SEEK_CUR);
        off_t size = lseek(fd, 0, SEEK_END);
        lseek(fd, pos, SEEK_SET);
        
        if (size == 0) {
            close(fd);
            f_size = -1;
        } else {
            int prot = PROT_READ;
            int flags = MAP_SHARED;
            
            void* ptr;
            int pagesize = getpagesize();
            if (size % pagesize != 0) {
                
                ptr = mmap(NULL, size + 1, prot, flags, fd, 0);
            } else {
                size_t fullsize = size + pagesize;
                
                ptr = mmap(NULL, fullsize, PROT_NONE, MAP_PRIVATE | MAP_ANON, -1, 0);
                ptr = mmap(ptr, fullsize, prot, flags | MAP_FIXED, fd, 0);
            }

            if (ptr == MAP_FAILED) {
                close(fd);
                f_size = -1;
            } else {
                f_size = size;
                fmap = (char*)ptr;
                opening = true;
            }
        }
    }
    
    bool reader_t::is_open() {
        return opening;
    }
    
    void reader_t::close_conn() {
        munmap(fmap, f_size);
        close(fd);
        opening = false;
    }
}
