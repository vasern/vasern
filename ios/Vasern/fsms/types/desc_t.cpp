#include "desc_t.h"

namespace vs {
    
    std::unordered_map<std::string, vs::prop_desc_t> type_mapped_str = {
        { "boolean", vs::BOOLEAN },
        { "string", vs::STRING },
        { "int", vs::INT_N },
        { "long", vs::LONG_N },
        { "double", vs::DOUBLE_N },
        { "datetime", vs::LONG_N }
    };
    
    desc_t::desc_t() : key("", ""), value("", "") {};
    
    desc_t::desc_t(col_key_t _key, col_str_t _value, std::vector<col_t*> _indexes, int _version)
    : key(_key)
    , value(_value)
    , indexes(_indexes)
    , version(_version)
    {
        calculate_position();
    };
    
    size_t desc_t::position_of(const char* name) {
        return _position[name];
    }
    
    size_t desc_t::block_size() {
        return b_size;
    }
    
    size_t desc_t::size_of(const char* name) {
        return _size[name];
    }
    
    std::string desc_t::key_str() {
        return key.name;
    }
    
    std::string desc_t::value_str() {
        return std::string(value.name)
        .append(":")
        .append(std::to_string(value.size()));
    }
    
    std::string desc_t::indexes_str() {
        std::string rs;
        
        for (auto it: indexes) {
            rs.append(it->name)
            .append(":")
            .append(std::to_string(it->size()))
            .append(",")
            .append(std::to_string(it->type))
            .append(";");
        }
        
        return rs;
    }
    
    col_t* desc_t::create_col(const char* type, const char* name, size_t size) {
        return create_col(type_mapped_str[type], name, size);
    }
    
    col_t* desc_t::create_col(prop_desc_t type, const char* name, size_t size) {
        
        col_t* item;
        
        switch (type) {
            case STRING:
                item = new col_str_t(name, "", size);
                break;
                
            case INT_N:
                item = new col_int_t(name, 0);
                break;
                
            case LONG_N:
                item = new col_long_t(name, 0);
                break;
                
            case DOUBLE_N:
                item = new col_double_t(name, 0);
                break;
                
            case BOOLEAN:
                item = new col_bool_t(name, false);
                break;
                
            default:
                item = new col_str_t(name, "", size);
                break;
        }
        
        return item;
    }
    
    void desc_t::calculate_position() {
        
        size_t _pos = key.size();
        
        for (auto it : indexes) {
            _position[it->name] = _pos;
            _size[it->name] = it->size();
            
            _pos += it->size();
        }
        
        _position["key"] = 0;
        _position["value"] = _pos;
        
        b_size = _pos + value.size();
    }
}
