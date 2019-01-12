
#include "collect_t.h"
#include "values/value_f.h"

namespace vs {

    collect_t::collect_t() { }

    collect_t::collect_t(const char* dir, const char* _name, layout_t _layout)
    : layout(_layout), path(std::string(dir).append("/").append(_name).append(".bin"))
    {
        init_index();
        writer = new writer_t(this->path.c_str(), &layout);
    }
    
    collect_t::collect_t(const char* dir, const char* _name, layout_t _layout, bool _startup)
    : layout(_layout), path(std::string(dir).append("/").append(_name).append(".bin"))
    {
        writer = new writer_t(this->path.c_str(), &layout);
        if (_startup) {
            startup();
        }
    }
    
    void collect_t::insert(upair_t* row) {
        writer->build(row);
        size_t pos = writer->write();
        indexes.push(value_ptr(new value_i<size_t>{ pos, *row }));
    }
    
    void collect_t::update(value_t* key, upair_t *changes) {
        upair_t id = {{ "id", key }};
        auto ptr = indexes.get(&id);
        size_t pos = ptr->value;
        size_t new_pos = writer->update(pos, changes);
        
        if (pos != new_pos) {
            ptr->set_value(new_pos);
        }
        
        for (auto & itr: *changes) {
            
            indexes.move(itr.first, ptr->items[itr.first], itr.second, ptr);
            ptr->items[itr.first] = itr.second;
        }
    }

    void collect_t::remove_keys(std::vector<const char*> key) {
        
        writer->open_trunc();
        
        for (auto iid : key) {
            upair_t query = {{ "id", value_f::create(iid) }};
            auto ptr = indexes.pop(&query);
            if (ptr) {
                indexes.remove(ptr);
                writer->remove(ptr->value);
            }
        }
        
        writer->close_conn();
        
        // TODO: design errors
    }

    // IO
    void collect_t::open_writer() {
//        writer = new writer_t(path.c_str(), &desc);
        writer->open_conn();
    }
    
    void collect_t::open_writer_update() {
        writer->open_trunc();
    }

    void collect_t::close_writer() {
        writer->close_conn();
    }

    void collect_t::open_reader() {
        reader = new reader_t(path.c_str(), &layout);
    }

    void collect_t::close_reader() {
        reader->close_conn();
    }
    
    type_desc_t collect_t::type_of(const char* key) {
        return indexes.type_of(key);
    }
    
    void collect_t::startup() {
        
        init_index();
        
        open_reader();
        
        if (reader->is_open()) {
            
            block_reader r = reader->get(0);
            size_t pos = 0;
            
            value_ptr index_value;
            
            while ( r.is_valid() ) {
                auto tags = r.tags();
                index_value = value_ptr(new value_i<size_t>{ pos, tags });
                indexes.push(index_value);
                
                pos += r.total_blocks();
                r.next();
            }
            
            close_reader();
        }
    }
    
    void collect_t::init_index() {
        std::unordered_map<std::string, type_desc_t> schema;
        for (auto itr : layout.keys) {
            schema.insert({ itr.name, itr.type });
        }
        indexes = index_set<size_t>(schema);
    }
    
    block_reader* collect_t::get(const char* id) {
        upair_t query = {{ "id", value_f::create(id) }};
        size_t i = indexes.get(&query)->value;
        
        // TODO: add value_ptr to index_t::create
        // - through error if not found
        return reader->get_ptr(i);
    }
    
    std::vector<block_reader*> collect_t::filter(upair_t* query) {
        auto items = indexes.filter(query);
        std::vector<block_reader*> rs;
        
        for (auto itr : items) {
            rs.push_back(reader->get_ptr(itr->value));
        }
        
        return rs;
    }
    
    block_reader* collect_t::first() {
        return reader->get_ptr(0);
    }
    
    std::vector<block_reader*> collect_t::filter(upair_t* query, const char* order_by, bool desc) {
        auto items = indexes.filter(query, order_by, desc);
        std::vector<block_reader*> rs;
        
        for (auto itr : items) {
            rs.push_back(reader->get_ptr(itr->value));
        }
        
        return rs;
    }

    
    size_t collect_t::count(upair_t* query) {
        return indexes.filter(query).size();
    }
    
    const char* collect_t::get_id(upair_t * query) {
        
        return indexes.get_id(query);
    }
    
    void collect_t::remove_all_records() {
        writer->remove_all();
        indexes.remove_all();
    }
}
