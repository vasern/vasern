#include "fsm.h"
#include "values/value_f.h"

namespace vs {

    fsm::fsm()
    : version(0), ready(false)
    , meta_path("/meta.bin"), dir(".") { }

    fsm::fsm(const char* path)
    : version(0), ready(false)
    , meta_path(std::string(path).append("/meta.bin")), dir(path)
    {
        
        layout = layout_t({
            col_t("collection", STRING, 55),
            col_t("b_size", NUMBER),
        }, 255);
        
        writer = new writer_t(this->meta_path.c_str(), &layout);
        startup();
        ready = true;
    }
    
    std::shared_ptr<collect_t> fsm::select(const char* name) {
        return collections[name];
    }
    
    // IO
    void fsm::open_writer() {
        writer->open_conn();
    }
    
    void fsm::close_writer() {
        writer->close_conn();
    }
    
    void fsm::open_reader() {
        reader = new reader_t(meta_path.c_str(), &layout);
    }
    
    void fsm::close_reader() {
        reader->close_conn();
    }
    
    void fsm::startup() {

        open_reader();
        if (reader->is_open()) {
            int total = (int)(reader->size() / layout.size());
            
            block_reader r = reader->get(0);
            collections.reserve(total);
            
            std::string name, key;
            layout_t cd;
            
            upair_t data;
            while (r.is_valid()) {

                data = r.object();
                schema_t columns;
                type_desc_t t;

                for (auto itr: data["columns"]->list_values()) {
                    std::vector<value_t*> a = itr->list_values();
                    
                    auto ab = a[2]->number_value();
                    ab =a[1]->number_value();
                    t = static_cast<type_desc_t>(a[1]->number_value());
                    if (t == STRING) {
                        columns.push_back(col_t(a[0]->str_value(), t, a[2]->number_value()));
                    } else {
                        columns.push_back(col_t(a[0]->str_value(), t));
                    }
                    
                }
                cd = layout_t(columns, data["b_size"]->number_value());
                name.assign(data["collection"]->str_value());
                
                collections[name] = std::shared_ptr<collect_t>(new collect_t(dir.c_str(), name.c_str(), cd, true));
                
                r.next();
            }
            
            version = 1;
            close_reader();
        }
    }
    
    void fsm::setup(std::unordered_map<std::string, layout_t> desc) {
        
        open_writer();
        
        
        for (auto it : desc) {
            
            std::vector<value_t*> columns;
            
            for (auto sitr: it.second.keys) {
                columns.push_back(value_f::create({
                    value_f::create(sitr.name),
                    value_f::create(sitr.type),
                    value_f::create(sitr.size)
                }));
            }
            
            upair_t shape = {
                { "collection", value_f::create(it.first) },
                { "b_size", value_f::create(it.second.size()) },
                { "columns", value_f::create(columns) }
            };
            
            writer->build(&shape);
            writer->write();
            
            collections[it.first] = std::shared_ptr<collect_t>(new collect_t(dir.c_str(), it.first.c_str(), it.second));

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
        type_desc_t type;
        std::string name;
        
        
        while (next_pos < desc_size) {
            
            name = desc.substr(last_pos, next_pos - last_pos);
            
            last_pos = next_pos + 1;
            next_pos = desc.find(",", last_pos);
            
            size = std::atol(desc.substr(last_pos, next_pos - last_pos).c_str());
            
            last_pos = next_pos + 1;
            next_pos = desc.find(";", last_pos);
            
            type = (type_desc_t)std::atoi(desc.substr(last_pos, next_pos - last_pos).c_str());
            
            last_pos = next_pos + 1;
            next_pos = desc.find(":", last_pos);
            
            rs.push_back(new col_t(name, type, size));
        }
        
        return rs;
    }
    
    bool fsm::verify_collections(int num_of_collect) {
        if (ready) {
            return num_of_collect == (int)collections.size();
        }
        
        return false;
    }
    
    void fsm::clear_all_collections() {
        for (auto itr: collections) {
            itr.second->remove_all_records();
        }
    }
}
