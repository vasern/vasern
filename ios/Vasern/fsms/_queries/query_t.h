#ifndef query_t_h
#define query_t_h

namespace vs {

    enum filter_t { EQUAL, BETWEEN, DESC };

    class query_t {
    public:

        query_t* find(const char* str);

        query_t* filter(const char* str);
    };
}

#endif