#include "../../../../ios/Vasern/src/types.h"
#include "../../../../ios/Vasern/src/layout.h"
#include <vector>
#include <ReactBridge.hpp>
#include <JavascriptArray.hpp>
//a
namespace vs_utils
{

    // Converting JavascripArray to vasern upair_t
    vs::upair_t jsmap_to_upair(const std::shared_ptr<JavascriptMap> &);
    vs::ulist_t jsarray_to_ulist(const std::shared_ptr<JavascriptArray>&);

    std::shared_ptr<JavascriptMap> upair_to_jsmap(vs::upair_t, std::shared_ptr<ReactBridge> &);
    std::shared_ptr<JavascriptArray> ulist_to_jsarray(vs::ulist_t, std::shared_ptr<ReactBridge> &);
    vs::upair_t jsmap_to_query(const std::shared_ptr<JavascriptMap> &);


    std::vector<const char*> to_vector(const std::shared_ptr<::JavascriptArray> &);

    //vs::type_desc_t type_of(NSObject* any);
    std::unordered_map<std::string, vs::layout_t> to_database_model(
        const std::shared_ptr<::JavascriptMap> &
    );
} // namespace vs_utils