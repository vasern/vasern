
#include "fsm.h"
#include "types/col_types.h"
#include <unordered_map>



int main(int nargs, const char* args[]) {


    vs::fsm fsm("./fsm");

    
//    vs::desc_t todo(
//        vs::col_key_t("_id", ""),
//        vs::col_str_t("junk", "nothing"),
//        {
//            new vs::col_bool_t("is_completed", false),
//            new vs::col_int_t("created_on", 12)
//        },
//        1
//    );
//    
//    std::unordered_map<std::string, vs::desc_t> desc = {{ "todo", todo }};
//    fsm.setup(desc);

    auto todo = fsm.select("todo");

    if (todo != nullptr) {
        todo->open_writer();
        int i = 0;
        std::string buff, key;
        while (i++ < 100000) {
            key.assign("random_id_").append(std::to_string(i));
            vs::row_desc_t row = {
                vs::col_key_t("_id", key),
                vs::col_str_t("junk", "test junk anything"),
                {
                    new vs::col_bool_t("is_completed", false),
                    new vs::col_int_t("created_on", 12)
                }
            };
            
            todo->insert(&buff, row);
        }
        todo->close_writer();
    }
    
//    if (collection != nullptr) {
//        collection->open_reader();
//        vs::record_t* r = collection->reader->get_ptr(0);
//        int i = 0;
//        while (r->valid() && i++ < 100) {
//            printf("Id of %d is %s\n", i, r->str_value("_id").c_str());
//        }
//        collection->close_reader();
//    }
    
    // const char* key;
    // collection.remove(key);
    // collection.close_writer();

    // record_t dcol.find("id", EQUAL, "something");
    // record_t[] dcol.filter("date", EQUAL, 12034).sort("date", "desc").limit(10).exec();
    
    // record_t[] dcol.filter(["age", BETWEEN, [20,21]], ["date",EQUAL,2012]).sort("date", DESC).exec();
    
    // record_t[] dcol.filter("date").between(1023,2039).exec()
    // record_t[] dcol.filter("age").equal([1023,3954]).exec()
    // record_t[] dcol.filter("comment_id").equal("post_id_12").exec();
    // record_t[] dcol.filter("comment_id").equal("post_id_12").or("author_id").equal("post_id_12").exec();
    // record_t[] dcol.filter([["comment_id", EQUAL, "c_id_111"],{ }])
    // int dcol.count("date").between(293,495).exec()

    return 0;
}
