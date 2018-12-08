#include "fsm.h"
#include "config.h"

namespace vs {

    fsm::fsm(const char* path)
    : dir(path)
    , meta_path(std::string(path).append("/meta.bin"))
    , ready(false)
    , version(0) {
        meta = desc_t({
            col_key_t("collection", ""),
            col_str_t("desc", "", 100),
            {
                new col_long_t("block_size", 0),
                new col_long_t("v_block_size", 0),
                new col_int_t("version", 0),
                new col_str_t("id", "", 20),
                new col_str_t("indexes", "", 255),
            },
            1
        });
        
        writer = new writer_t(this->meta_path.c_str(), &meta);
        startup();
        ready = true;
    }

     std::shared_ptr<collect_t> fsm::select(const char* name) {
        return collections[name];
    }

    // IO
    void fsm::open_writer() {
        writer->open_conn();
//        writer = new writer_t(meta_path.c_str(), &meta);
    }

    void fsm::close_writer() {
        writer->close_conn();
    }

    void fsm::open_reader() {
        reader = new reader_t(meta_path.c_str(), &meta);
    }

    void fsm::close_reader() {
        reader->close_conn();
    }

    void fsm::startup() {

        // TODO: open reader
        open_reader();
        if (reader->is_open()) {
            int total = (int)(reader->size() / meta.block_size());
            
            record_t* r = reader->get_ptr(0);
            collections.reserve(total);
            
            std::string name, key;
            desc_t cd;
            
            //TOOD: block size
            
            while (r != NULL && r->valid()) {
                
                name = r->key();
                
                cd = desc_t(col_key_t("collection", r->str_value("id")),
                            col_str_t("desc", r->value(), r->long_value("v_block_size")),
                            str_parse(r->str_value("indexes")),
                            r->int_value("version"));

                collections[name] = std::shared_ptr<collect_t>(new collect_t(dir.c_str(), name.c_str(), cd, true));
                r = r->next_ptr();
            }
            
            version = 1;
            close_reader();
        }
    }

    void fsm::setup(std::unordered_map<std::string, desc_t> desc) {

        open_writer();
        
        std::string buff;
        
        desc_t table_desc;
        
        for (auto it : desc) {
            
            table_desc = it.second;
            
            writer->insert(&buff, {
                col_key_t("collection", it.first),
                col_str_t("desc", table_desc.value.name),
                {
                    new col_long_t("block_size", 1),
                    new col_long_t("v_block_size", table_desc.value.size()),
                    new col_int_t("version", 1),
                    new col_str_t("id", table_desc.key_str()),
                    new col_str_t("indexes", table_desc.indexes_str())
                }
            });
            
            collections[it.first] = std::shared_ptr<collect_t>(new collect_t(dir.c_str(), it.first.c_str(), table_desc));
            
        }
        
        version = 1;
        close_writer();
    }
    
    std::vector<col_t*> fsm::str_parse(std::string desc) {
        
        std::vector<col_t*> rs;
        
        size_t next_pos = desc.find(":");
        size_t last_pos = 0;
        size_t desc_size = desc.size();
        size_t size;
        prop_desc_t type;
        std::string name;
        
        
        while (next_pos < desc_size) {
            
            name = desc.substr(last_pos, next_pos - last_pos);
            
            last_pos = next_pos + 1;
            next_pos = desc.find(",", last_pos);
            
            size = std::atol(desc.substr(last_pos, next_pos - last_pos).c_str());
            
            last_pos = next_pos + 1;
            next_pos = desc.find(";", last_pos);
            
            type = (prop_desc_t)std::atoi(desc.substr(last_pos, next_pos - last_pos).c_str());
            
            last_pos = next_pos + 1;
            next_pos = desc.find(":", last_pos);
            
            rs.push_back(desc_t::create_col(type, name.c_str(), size));
        }
        
        return rs;
    }
    
    bool fsm::verify_collections(int num_of_collect) {
        if (ready) {
            return num_of_collect == collections.size();
        }
        
        return false;
    }
}
