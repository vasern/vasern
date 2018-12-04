#ifndef collect_t_h
#define collect_t_h

#include "io/reader_t.h"
#include "io/writer_t.h"

#include "index_set/queries/query_t.h"
#include "index_set/queries/index_set.h"
#include "types/desc_t.h"

#include <string>

namespace vs {

    class collect_t {
    public:
        desc_t desc;

        collect_t();
        collect_t(const char* path, const char* name, desc_t desc);
        collect_t(const char* path, const char* name, desc_t desc, bool startup);

        void insert(std::string* buff, row_desc_t row);
        void remove(const char* key);

        void open_writer();
        void close_writer();

        void open_reader();
        void close_reader();

        record_t* get(const char*);
        std::vector<record_t*> filter(vs::upair_t*);
        
        size_t count(upair_t*);
        
        void startup();
        
        vs::value_ptr load_i_value(record_t* r, size_t pos);
        
        prop_desc_t type_of(const char*);
        const char* get_id(vs::upair_t*);
        
    private:
        
        std::unordered_map<std::string, size_t> ids;
        vs::index_set<size_t> indexes;
        
        reader_t* reader;
        writer_t* writer;
        
        std::string path;
        
        void init_index();
    };
}

#endif
