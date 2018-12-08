// Example

#include "query_t.h"
#include "index_set.h"


map<string, T> imstore

// Create index with different types
// struct index_set_t { set: map<string, prop_desc_t> }
index_set<size_t> set({
    "ids": STRING,
    "is_verified": BOOLEAN,
    "created_on": INT_N
});

// Push index values into created index above
// push(index_value)
// struct v_value { value: T, vector<i_value> }
// struct i_value (const char* name, T value)
set.push({
    value: 20,
    {
        "ids": ivt("abcds"),
        "is_verified": ivt(false),
        "created_on": ivt(20181125)
    }
});

// EQ: any types
// LESS_THAN, GREATE_THAN, BETWEEN: numbers

// Query
// struct query_t { vector<query_desc_t> }
// struct query_desc_t { key: string, value: T }
// => struct result_t { count: size_t, items: vector<size_t> (positions) }
set.filter({
    EQ("is_verified", false),
    BETWEEN("created_on", 20181100, 20181200)
});

set.get(query_desc_t)
