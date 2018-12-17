//
//  block_helper.cpp
//  CiPlayground
//
//  Created by Hieu (Jack) Nguyen on 12/12/18.
//  Copyright © 2018 Ambi Studio. All rights reserved.
//

#include "block_helper.h"
#include "block_config.h"
#include "../values/value_f.h"

namespace vs {
    
    // Read self-describe object
    void block_helper::read_obj(upair_t* rs, size_t *_pos, int num_of_props, char* fmap) {
        
        char* name = nullptr;
        size_t pos = *_pos;
        type_desc_t type;
        int size = 0, nb;
        
        while (num_of_props-- > 0) {
            
            type = static_cast<type_desc_t>(fmap[pos]);
            pos += TYPE_SIZE;
            
            // Property size
            size = (int)(fmap[pos] & 0xff);
            pos += TYPE_SIZE;
            
            // Get property str
            name = new char[size];
            read_str(pos, size, fmap, name);
            pos += size;
            
            switch (type) {
                    
                case STRING: {
                    
                    (*rs)[name] = get_str(&pos, fmap);
                    
                    break;
                }
                case NUMBER: {
                    
                    (*rs)[name] = get_number(pos, fmap);
                    pos += NUMBER_SIZE;
                    
                    break;
                }
                case BOOLEAN: {
                    
                    (*rs)[name] = get_bool(pos, fmap);
                    pos += BOOL_SIZE;
                    
                    break;
                }
                case OBJECT: {
                    
                    upair_t obj;
                    nb = fmap[pos] & 0xff;
                    pos += TYPE_SIZE;
                    read_obj(&obj, &pos, nb, fmap);
                    (*rs)[name] = value_f::create(obj);
                    
                    break;
                }
                case LIST: {
                    
                    ulist_t list;
                    nb = fmap[pos] & 0xff;
                    pos += TYPE_SIZE;
                    read_list(&list, &pos, nb, fmap);
                    (*rs)[name] = value_f::create(list);
                    
                    break;
                }
                default:
                    
                    break;
            }
            
        }
        
        *_pos = pos;
    }
    
    void block_helper::read_list(std::vector<value_t*>* rs, size_t *pos, int num_of_items, char* fmap) {
        
        size_t ibp = *pos;
        type_desc_t type;
        int nb;
        
        while (num_of_items-- > 0) {
            
            type = static_cast<type_desc_t>(fmap[ibp]);
            ibp += TYPE_SIZE;
            
            switch (type) {
                    
                case STRING:
                    
                    rs->push_back(get_str(&ibp, fmap));
                    
                    break;
                    
                case NUMBER:
                    
                    rs->push_back(get_number(ibp, fmap));
                    ibp += NUMBER_SIZE;
                    
                    break;
                    
                case BOOLEAN:
                    
                    rs->push_back(get_bool(ibp, fmap));
                    ibp += BOOL_SIZE;
                    
                    break;
                    
                case OBJECT: {
                    
                    upair_t obj;
                    nb = fmap[ibp] & 0xff;
                    ibp += TYPE_SIZE;
                    read_obj(&obj, &ibp, nb, fmap);
                    rs->push_back(value_f::create(obj));
                    
                    break;
                }
                case LIST: {
                    
                    ulist_t list;
                    nb = fmap[ibp] & 0xff;
                    ibp += TYPE_SIZE;
                    read_list(&list, &ibp, nb, fmap);
                    rs->push_back(value_f::create(list));
                    
                    break;
                }
                default:
                    
                    break;
            }
            
        }
        
        *pos = ibp;
    }
    
    value_t* block_helper::get_str(size_t *pos, char *fmap) {
        
        
        
        size_t _pos = *pos;
        int size = fmap[_pos] & 0xff;
        char buff[size + 1];
        int buff_pos = 0;
        _pos += TYPE_SIZE;
        
        while (buff_pos < size){
            buff[buff_pos++] = fmap[_pos++];
        }
        
        buff[buff_pos] = '\0';
        *pos += size + TYPE_SIZE;
        
        return value_f::create(buff);
    }
    
    
    value_t* block_helper::get_number(size_t pos, char* fmap) {
        // TODO: check number
        //return value_f::create((double long&)fmap[pos]);
        double number;
        char *buff = reinterpret_cast<char*>(&number);
        std::memcpy(&buff[0], &fmap[pos], NUMBER_SIZE);
        return value_f::create(number);
    }
    
    value_t* block_helper::get_bool(size_t pos, char *fmap) {
        return value_f::create((bool&)fmap[pos]);
    }
    
    void block_helper::read_str(size_t pos, int len, char *fmap, char* buff) {
        int i = 0;
        
        while (i < len) {
            buff[i++] = fmap[pos++];
        }
        
        buff[i] = '\0';
    }
}
