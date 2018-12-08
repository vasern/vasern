#include "row_t.h"

#include <regex>

namespace vs {
    
    row_t::row_t() { }
    
    row_t::row_t(std::vector<col_t> _cols)
    : cols(_cols) {
        cal_size();
    }
    
    row_t::row_t(std::string desc) {
        
//        std::regex r{R"([^;]+;)"};
//        
//        std::vector<std::string> tokens{std::sregex_token_iterator{std::begin(desc), std::end(desc), r}, std::sregex_token_iterator{}};
//        
//        
//        
//        int delim_pos, delime2_pos;
//        int len;
//        prop_desc_t type;
//        col_t col_temp;
//
//        for (auto&& t : tokens) {
//            delim_pos = (int)t.find(":");
//            delime2_pos = (int)t.find(",");
//            
//            const char* key = t.substr(0, delim_pos).c_str();
//            len = atoi(t.substr(delim_pos + 1, t.size() - delime2_pos - 1).c_str());
//            type = (prop_desc_t)atoi(t.substr(delime2_pos + 1, 1).c_str());
//             
//             
//            if (type == STRING) {
////                cols.push_back(col_t(key, len, STRING));
//            } else {
////                cols.push_back(col_t(key, type));
//            }
//        }
        
        organize();
    }
    
    size_t row_t::size() {
        return b_size;
    }
    
    void row_t::organize() {
        cal_size();
        sort_cols();
    }
    
    void row_t::cal_size() {
        b_size = 0;
        for (auto it : cols) {
            b_size += it.size();
        }
    }
    
    void row_t::sort_cols() {
//        std::sort(cols.begin(), cols.end(),
//                  []( const col_t &left, const col_t &right )
//                  { return ( left.size < right.size ) || ( left.name < right.name); }
//                  );
    }
    
    int row_t::index_of(col_t t) {
//        auto it = std::find(cols.begin(), cols.end(), t);
//        return (int)std::distance(cols.begin(), it);
        return 0;
    }
    
    int row_t::index_of(const char* _name) {
        
        auto it = std::find_if(cols.begin(), cols.end(),
                               [&_name](col_t const& cmp_item) {
                                   return cmp_item.name.compare(_name) == 0;
                               });
        if (it != cols.end()) {
            return (int)std::distance(cols.begin(), it);
        }
        return -1;
    }
    
    col_t* row_t::find(const char* _name) {
        
        auto it = std::find_if(cols.begin(), cols.end(),
                               [&_name](col_t const& cmp_item) {
                                   return cmp_item.name.compare(_name) == 0;
                               });
        if (it != cols.end()) {
            int i = (int)std::distance(cols.begin(), it);
            return &cols.at(i);
        }
        
        return NULL;
    }
    
    col_t* row_t::at(int pos) {
        return &cols.at(pos);
    }
    
    std::string row_t::str_desc() {
        std::string rs;
        
//        for (auto it: cols) {
//            rs.append(it.name)
//            .append(":")
//            .append(std::to_string(it.size))
//            .append(",")
//            .append(std::to_string(it.type))
//            .append(";");
//        }
            
        return rs;
    }
}
