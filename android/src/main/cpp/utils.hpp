#include "../../../../ios/Vasern/src/types.h"
#include "../../../../ios/Vasern/src/layout.h"
#include "../../../../ios/Vasern/src/io/block_reader.h"

#include <vector>
#include <ReactBridge.hpp>
#include <JavascriptArray.hpp>

namespace vs_utils
{

    vs::upair_t jsmap_to_upair(
        const std::shared_ptr<JavascriptMap> &
    );

    vs::ulist_t jsarray_to_ulist(
        const std::shared_ptr<JavascriptArray>&
    );

    std::shared_ptr<JavascriptMap> upair_to_jsmap(
        vs::upair_t,
        std::shared_ptr<ReactBridge> &
    );

    std::shared_ptr<JavascriptArray> ulist_to_jsarray(
        vs::ulist_t,
        std::shared_ptr<ReactBridge> &
    );

    vs::upair_t jsmap_to_query(
        const std::shared_ptr<JavascriptMap> &
    );

    std::vector<const char*> to_vector(
        const std::shared_ptr<::JavascriptArray> &
    );

    std::unordered_map<std::string, vs::layout_t> to_database_model(
        const std::shared_ptr<::JavascriptMap> &
    );

    void extract_records(
        std::shared_ptr<ReactBridge> & mBridge,
        std::vector<vs::block_reader*> ptrs,
        std::shared_ptr<JavascriptArray> & records
    );

    void extract_records(
        std::shared_ptr<ReactBridge> & mBridge,
        std::vector<vs::block_reader*> ptrs,
        std::shared_ptr<JavascriptArray> & records,
        int max,
        int page
    );

} // namespace vs_utils