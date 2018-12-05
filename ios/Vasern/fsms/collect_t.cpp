
#include "collect_t.h"
#include "index_set/queries/value_f.h"

namespace vs {

    collect_t::collect_t() { }

    collect_t::collect_t(const char* dir, const char* _name, desc_t _desc)
    : path(std::string(dir).append("/").append(_name).append(".bin"))
    , desc(_desc)
    {
        writer = new writer_t(this->path.c_str(), &desc);
    }
    
    collect_t::collect_t(const char* dir, const char* _name, desc_t _desc, bool _startup)
    : path(std::string(dir).append("/").append(_name).append(".bin"))
    , desc(_desc)
    {
        writer = new writer_t(this->path.c_str(), &desc);
        if (_startup) {
            startup();
        }
    }
    
    void collect_t::insert(std::string* buff, row_desc_t row) {
        
        size_t pos = writer->insert(buff, row);
        
        indexes.push(value_ptr(new value_i<size_t>{ pos, row.pairs }));
    }

    void collect_t::remove(std::vector<const char*> key) {
        
        writer->open_trunc();
        
        for (auto iid : key) {
            upair_t query = {{ "id", value_f::create(iid) }};
            auto found = indexes.get(&query);
            if (found) {
                
                writer->remove(found->value);
                indexes.remove(found);
            }
        }
        
        writer->close_trunc();
        
        // TODO: throw error
    }

    // IO
    void collect_t::open_writer() {
//        writer = new writer_t(path.c_str(), &desc);
        writer->open_conn();
    }
    
    void collect_t::open_writer_u() {
        writer->open_trunc();
    }

    void collect_t::close_writer() {
        writer->close_conn();
    }

    void collect_t::open_reader() {
        reader = new reader_t(path.c_str(), &desc);
    }

    void collect_t::close_reader() {
        reader->close_conn();
    }
    
    value_ptr collect_t::load_i_value(record_t* r, size_t pos) {
        upair_t items = {{ "id", value_f::create(r->key()) }};
        
        for (auto itr : desc.indexes) {
            // TODO: handle duplicate/repeat issue
            items[itr->name] = value_f::create(r, itr->type, itr->name.c_str());
            
        }
        
        return value_ptr(new value_i<size_t>{ pos, items });
    }
    
    prop_desc_t collect_t::type_of(const char* key) {
        return indexes.type_of(key);
    }
    
    void collect_t::startup() {
        
        init_index();
        
        open_reader();
        
        if (reader->is_open()) {
            
            // TODO: Load ids and indexes
            size_t num_of_blocks = reader->size() / desc.block_size();
            ids.reserve(num_of_blocks);
            
            record_t* r = reader->get_ptr(0);
            size_t pos = 0;
            
            value_ptr index_value;
            while (r->valid()) {
                
                index_value = load_i_value(r, pos);
                indexes.push(index_value);
                
                pos += r->total_blocks();
                r = r->next_ptr();
            }
            
            close_reader();
        }
    }
    
    void collect_t::init_index() {
        std::unordered_map<std::string, prop_desc_t> schema = {{ "id", KEY }};
        for (auto itr : desc.indexes) {
            schema.insert({ itr->name, itr->type });
        }
        indexes = index_set<size_t>(schema);
    }
    
    record_t* collect_t::get(const char* id) {
        upair_t query = {{ "id", value_f::create(id) }};
        size_t i = indexes.get(&query)->value;
        
        // TODO: add value_ptr to index_t::create
        // - through error if not found
        return reader->get_ptr(i);
    }
    
    std::vector<record_t*> collect_t::filter(upair_t* query) {
        auto items = indexes.filter(query);
        std::vector<record_t*> rs;
        
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
}
