
#ifndef fsm_h
#define fsm_h

#include "collect_t.h"

#include <unordered_map>

namespace vs {
    
    class fsm {
    public:
        
        int version;
        fsm();
        fsm(const char* path);
        
        std::shared_ptr<collect_t> select(const char* name);
        
        void setup(std::unordered_map<std::string, layout_t> descs);
        
        bool verify_collections(int);
        void clear_all_collections();

        // This config method will setup the database (file path, layout, writer, ...)
        // Used for React Native on Android as cannot(*) startup with the file location
        // (*) not for now
        void config(std::string path);
        
    private:
        
        bool ready;
        
        // Load str desc
        std::vector<col_t*> str_parse(std::string index_str);
        
        std::unordered_map<std::string, std::shared_ptr<collect_t>> collections;
        
        std::string meta_path;
        std::string dir;
        layout_t layout;
        
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
