
#ifndef row_t_h
#define row_t_h

#include <vector>
#include <algorithm>
#include "col_t.h"

namespace vs {

    class row_t {
    public:
        std::vector<col_t> cols;
        
        row_t();
        row_t(std::vector<col_t> _cols);
        row_t(std::string desc);
        
        void organize();
        void cal_size();
        void sort_cols();
        
        int index_of(col_t t);
        int index_of(const char* _name);
        size_t size();
        
        col_t* find(const char* _name);
        col_t* at(int pos);
        
        std::string str_desc();
        
    private:
        
        size_t b_size;
    };
}

#endif
