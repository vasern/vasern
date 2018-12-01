
#ifndef fsm_h
#define fsm_h

#include "collect_t.h"

#include <unordered_map>

namespace vs {

    class fsm {
    public:

        int version;
    
        fsm(const char* path);

        std::shared_ptr<collect_t> select(const char* name);
        
        // 
        void setup(std::unordered_map<std::string, desc_t> descs);
        
        bool verify_collections(int);

    private:
        
        bool ready;
        
        // Load str desc 
        std::vector<col_t*> str_parse(std::string index_str);
        
        std::unordered_map<std::string, std::shared_ptr<collect_t>> collections;
        
        std::string meta_path;
        std::string dir;
        desc_t meta;

        void startup();

        void open_writer();
        void close_writer();
        void open_reader();
        void close_reader();

        writer_t* writer;
        reader_t* reader;
    };
}

#endif
