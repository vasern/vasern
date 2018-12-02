#include "queries/index_set.h"

int main(int argc, const char * argv[]) {

    vs::index_set<size_t> set({
        { "ids", vs::STRING },
        { "is_verified", vs::BOOLEAN },
        { "created_on", vs::INT_N }
    });
    
    std::shared_ptr<vs::value_i<size_t>> value(new vs::value_i<size_t>{ 25, {
        { "ids", vs::value_f::create("abcds")},
        { "is_verified", vs::value_f::create(false)},
        { "created_on", vs::value_f::create(20181125)}
    }});
    
    set.push(value);
    
    value = std::shared_ptr<vs::value_i<size_t>>(new vs::value_i<size_t>{ 26, {
        { "ids", vs::value_f::create("haha")},
        { "is_verified", vs::value_f::create(true)},
        { "created_on", vs::value_f::create(20181124)}
    }});
    set.push(value);
    
    value = std::shared_ptr<vs::value_i<size_t>>(new vs::value_i<size_t>{ 27, {
        { "ids", vs::value_f::create("haha")},
        { "is_verified", vs::value_f::create(false)},
        { "created_on", vs::value_f::create(20181124)}
    }});
    set.push(value);
    
    vs::upair_t query = {{ "ids", vs::value_f::create("abcds") }};
    auto found = set.filter(&query);
    
    vs::upair_t query2 = {
        { "created_on", vs::value_f::create(20181124)},
        { "is_verified", vs::value_f::create(true)}
    };
    auto found2 = set.filter(&query2);
    return 0;
};
