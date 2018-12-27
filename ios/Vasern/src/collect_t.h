#ifndef collect_t_h
#define collect_t_h

#include "io/reader_t.h"
#include "io/writer_t.h"

#include "index_set/index_set.h"
#include "types.h"

#include <string>

namespace vs {

    class collect_t {
    public:

        collect_t();
        collect_t(const char* path, const char* name, layout_t desc);
        collect_t(const char* path, const char* name, layout_t desc, bool startup);

        void insert(upair_t* row);
        void update(value_t* key, upair_t* changes);
        void remove_keys(std::vector<const char*> key);

        void open_writer();
        void close_writer();
        void open_writer_update();

        void open_reader();
        void close_reader();

        block_reader* get(const char*);
        std::vector<block_reader*> filter(upair_t*);
        std::vector<block_reader*> filter(upair_t*, const char*, bool);
        
        block_reader* first();
        
        size_t count(upair_t*);
        
        type_desc_t type_of(const char*);
        const char* get_id(upair_t*);
        
        void startup();
        void remove_all_records();
        
    private:
        
        vs::index_set<size_t> indexes;
        layout_t layout;
        
        reader_t* reader;
        writer_t* writer;
        
        std::string path;
        
        void init_index();
    };
}

#endif
