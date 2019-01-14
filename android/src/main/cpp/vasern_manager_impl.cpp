#include "vasern_manager_impl.hpp"
#include <string>
#include <JavascriptMapKeyIterator.hpp>

#include "../../../../ios/Vasern/src/values/value_f.h"

namespace vasern
{

    std::shared_ptr<VasernManager> VasernManager::create(
        const std::shared_ptr<::ReactBridge> &bridge)
    {
        return std::make_shared<VasernManagerImpl>(bridge);
    }

    VasernManagerImpl::VasernManagerImpl(
        const std::shared_ptr<::ReactBridge> &bridge)
        : mBridge(bridge)
    {
        mQueue = JobQueueImpl::create();
        mDispatcher = mBridge->createJobDispatcher(mQueue);
        mDispatcher->start();
    }

    VasernManagerImpl::~VasernManagerImpl() {
        mDispatcher->quit();
    }

	void VasernManagerImpl::Startup(
		const std::string &path,
		const std::shared_ptr<::JavascriptMap> &schema,
		const std::shared_ptr<::JavascriptPromise> &promise)
	{

		database.config(path);

        int total_keys = 0;
        auto keyItr = schema->keySetIterator();
        while (keyItr->hasNextKey())
        {
            keyItr->nextKey();
            total_keys++;
        }

        // TODO: check and match collections and its properties, types ?? or only version
        if (!database.verify_collections(total_keys))
        {
            auto model = vs_utils::to_database_model(schema);
            database.setup(model);
        }

        auto res = mBridge->createMap();
        res->putString("status", "ok");
        promise->resolveMap(res);
    }

    /**
     * Records structure
     * [{
     *  id: 'random_ugly_auto_generated_id1',
     *  firstName: 'Bryan',
     *  lastName: 'Griffin'
     * }, {
     *  id: 'random_ugly_auto_generated_id3',
     *  ...
     * }]
     */
    void VasernManagerImpl::InsertRecords(
        const std::string &collect,
        const std::shared_ptr<::JavascriptArray> &records,
        const std::shared_ptr<::JavascriptPromise> &promise
    ) {
        auto coll = database.select(collect.c_str());
        if (coll != nullptr) {

            size_t total = 0;
            coll->open_writer();
            vs::upair_t r_pairs;

            for (int i = 0; i < records->size(); i++) {

                r_pairs = vs_utils::jsmap_to_upair(records->getMap(i));

                coll->insert(&r_pairs);
                r_pairs.clear();
                total++;
            }

            coll->close_writer();

            auto res = mBridge->createMap();
            auto changes = mBridge->createMap();
            changes->putInt("inserted", records->size());
            changes->putInt("updated", 0);
            changes->putInt("removed", 0);
            changes->putInt("unchanged", 0);

            res->putMap("changes", changes);
            res->putString("status", "ok");
            promise->resolveMap(res);
        } else {
            promise->reject("no_collection", "Collection does not exist!");
        }
    }


    void VasernManagerImpl::UpdateRecords(
        const std::string &collect,
        const std::shared_ptr<::JavascriptMap> &records,
        const std::shared_ptr<::JavascriptPromise> &promise)
    {
        auto coll = database.select(collect.c_str());

        if (coll == nullptr) {
            promise->reject("no_collection", "Collection does not exist!");
        } else {

            coll->open_writer_update();
            auto keyItr = records->keySetIterator();
            std::string prop;
            vs::upair_t updated_props;

            if (keyItr->hasNextKey()) {
                prop = keyItr->nextKey();
                updated_props = vs_utils::jsmap_to_upair(records->getMap(prop));
                coll->update(
                    vs::value_f::create(prop),
                    &updated_props);
            }
            coll->close_writer();

            auto res = mBridge->createMap();
            auto changes = mBridge->createMap();
            changes->putInt("inserted", 0);
            changes->putInt("updated", 0);
            changes->putInt("removed", 0);
            changes->putInt("unchanged", 0);

            res->putMap("changes", changes);
            res->putString("status", "ok");
            promise->resolveMap(res);
        }
    }

    void VasernManagerImpl::DeleteRecords(
        const std::string &collection_name,
        const std::shared_ptr<::JavascriptArray> &records,
        const std::shared_ptr<::JavascriptPromise> &promise)
    {
        std::shared_ptr<vs::collect_t> collect = database.select(collection_name.c_str());

        if (collect == nullptr)
        {
            promise->reject("no_collection", "Collection does not exist!");
        }
        else
        {

            collect->remove_keys(vs_utils::to_vector(records));

            auto res = mBridge->createMap();
            auto changes = mBridge->createMap();
            changes->putInt("inserted", 0);
            changes->putInt("updated", 0);
            changes->putInt("removed", records->size());
            changes->putInt("unchanged", 0);

            res->putMap("changes", changes);
            res->putString("status", "ok");
            promise->resolveMap(res);
        }
    }

    void VasernManagerImpl::RemoveAllRecords(
        const std::string &collection_name,
        const std::shared_ptr<::JavascriptPromise> &promise)
    {
        std::shared_ptr<vs::collect_t> collect = database.select(collection_name.c_str());

        if (collect == nullptr) {
            promise->reject("no_collection", "Collection does not exist!");
        }
        else {

            collect->remove_all_records();

            auto res = mBridge->createMap();
            auto changes = mBridge->createMap();
            changes->putInt("inserted", 0);
            changes->putInt("updated", 0);
            changes->putInt("removed", 0);
            changes->putInt("unchanged", 0);

            res->putMap("changes", changes);
            res->putString("status", "ok");
            promise->resolveMap(res);
        }
    }

    void VasernManagerImpl::RemoveAllCollections(
        const std::shared_ptr<::JavascriptPromise> &promise)
    {
        database.clear_all_collections();

        // TODO: Return number of collections
        auto res = mBridge->createMap();
        auto changes = mBridge->createMap();
        changes->putInt("inserted", 0);
        changes->putInt("updated", 0);
        changes->putInt("removed", 0);
        changes->putInt("unchanged", 0);

        res->putMap("changes", changes);
        res->putString("status", "ok");
        promise->resolveMap(res);
    }

    /**
     * Get records based on query. Available queries include:
     *
     * 1. $filter: find records that has property and value match exactly or within given range
     *
     * 2. $prefetch (optional): find cross-reference value.
     *      For example, with Tasks and Users collections, find all tasks that assigned to users
     *      whose has first name "Bryan". Prefetch all users called "BryanUsers" with firstName = "Bryan",
     *      then get all tasks that has "assignedUser" equal "BryanUsers.id"
     *
     * 3. $include (optional): find add include cross-reference object.
     *      For example, with Schedule and Users Collection, find user that belong to schedule
     *      and assign User as "ScheduleRecord.assignedUser"
     *
     * 4. $sort (optional): sort records by value
     *
     * 5. $limit (optional): limit number of records return.
     *
     * 6. $paging (optional, will be ignore if co-exist with $limit): records pagination
     *
     * Note:
     *  - $limit and $paging will reduce number of trip fetching records (good for performance)
     *  - $prefetch and $perform will increase number of operation (not so good for performance)
     *
     * *** Given schema:
     * Schedule : { id: uuid, completedDate: datetime, user_id: uuid, task_id: uuid },
     * Users: { id: uuid, firstName: string(55), lastName: string(55) }
     * Tasks: { id: uuid, title: string(55), description }
     *
     * *** Sample query structure
     *
     * {
     *    $filter: {
     *
     *      // find exact
     *      id: {
     *          equal: "example_id_1"
     *      },
     *
     *      // find within range (currently for number only)
     *      completedDate: {
     *          start: 20493948485, // sample date time in milliseconds
     *          end: 20493948985 // sample date time in milliseconds
     *      }
     *    },
     *
     *    $prefetch: {
     *
     *      // { collection name } : { query: similar to $filter query }
     *      Users: {
     *          firstName: {
     *              equal: "Bryan"
     *          }
     *      }
     *    },
     *
     *    // heavy perform
     *    $include: [
     *      {
     *          // reference collection
     *          relate: "Tasks",
     *
     *          // Tasks.scheduleId == ScheduleRecord.id
     *          idMatchField: "scheduleId", // not co-exist with refField
     *
     *          // Tasks.id == ScheduleRecord.taskId
     *          refField: "taskId",
     *      }
     *    ],
     *
     *    $sort: {
     *      // { prop name } : { true for asc, false for desc }
     *      // currently support last property
     *      completedDate: true
     *    }
     *
     *    $limit: 10, // cannot co-exist with $paging
     *    $paging: {
     *      max: 10,
     *      page: 2
     *    }
     * }
     */

    void VasernManagerImpl::GetRecordsByQuery(
        const std::string &collection_name,
        const std::shared_ptr<::JavascriptMap> &js_query,
        const std::shared_ptr<::JavascriptPromise> &promise)
    {

        std::shared_ptr<vs::collect_t> collect = database.select(collection_name.c_str());

        if (collect == nullptr) {
            promise->reject("no_collection", "Collection does not exist!");
        } else {

            auto res = mBridge->createMap();
            auto changes = mBridge->createMap();
            auto items = mBridge->createArray();

            changes->putInt("inserted", 0);
            changes->putInt("updated", 0);
            changes->putInt("removed", 0);
            changes->putInt("unchanged", 0);
            res->putMap("changes", changes);

            vs::upair_t query = vs_utils::jsmap_to_query(js_query->getMap("$filter"));

            if (js_query->hasKey("$prefetch")) {

                std::shared_ptr<vs::collect_t> pf_collect;
                std::string itrKey;

                auto pf_map = js_query->getMap("$prefetch");
                auto itr = pf_map->keySetIterator();
                vs::upair_t pf_query;

                while (itr->hasNextKey()) {
                    itrKey = itr->nextKey();
                    pf_collect = database.select(itrKey.c_str());
                    pf_query = vs_utils::jsmap_to_query(pf_map->getMap(itrKey));

                    query[itrKey] = vs::value_f::create(pf_collect->get_id( &pf_query ));

                    pf_query.clear();
                }

            }

            /**  ====== Sort  ====== */
            // Check if $sort is enabled
            // Then extract $sort properties

            std::vector<vs::block_reader*> rs;
            if (js_query->hasKey("$sort")) {

                // Get and sort first key
                auto sort_map = js_query->getMap("$sort");
                std::string sort_key = sort_map->keySetIterator()->nextKey();
                bool sort_desc = sort_map->getBoolean(sort_key);

                rs = collect->filter(&query, sort_key.c_str(), sort_desc);

            } else {
                rs = collect->filter(&query);
            }

            if (rs.size() == 0) {

                res->putArray("items", items);
                promise->resolveMap(res);
            } else {


                /**  ====== Pagination  ====== */
                collect->open_reader();

                if (js_query->hasKey("$limit")) {

                    vs_utils::extract_records(mBridge, rs, items, 0, js_query->getInt("$limit"));
                } else if (js_query->hasKey("$paging")) {

                    auto paging_q = js_query->getMap("$paging");
                    int max = paging_q->getInt("max");
                    int start = max * paging_q->getInt("page");

                    vs_utils::extract_records(mBridge, rs, items, start, start + max);
                } else {

                    vs_utils::extract_records(mBridge, rs, items);
                };

                collect->close_reader();


                /** ====== Include ====== */

                if (js_query->hasKey("$include")) {

                    auto inc_maps = js_query->getMap("$include");
                    auto inc_key_itr = inc_maps->keySetIterator();

                    vs::upair_t inc_q;
                    std::string inc_key;
                    std::shared_ptr<vs::collect_t> inc_collect;
                    std::shared_ptr<JavascriptMap> inc_map, inc_item;

                    // Iterate through each include object
                    if (inc_key_itr->hasNextKey()) {

                        inc_key = inc_key_itr->nextKey();
                        inc_map = inc_maps->getMap(inc_key);
                        inc_collect = database.select(inc_map->getString("relate").c_str());

                        std::vector<vs::block_reader*> inc_records;

                        bool is_multiple_records;

                        // Get and assign records that match with query
                        // for each item
                        for (int i = 0; i < items->size(); i++) {

                            inc_item = items->getMap(i);

                            if (inc_map->hasKey("filter")) {
                                inc_q = vs_utils::jsmap_to_query(inc_map->getMap("filter"));
                            }

                            if (inc_map->hasKey("idMatchField")) {

                                inc_q[inc_map->getString("idMatchField")] = vs::value_f::create(inc_item->getString("id"));
                                is_multiple_records = true;
                            } else if (inc_map->hasKey("refField")) {
                                inc_q["id"] = vs::value_f::create(inc_map->getString("refField"));
                                is_multiple_records = false;
                            }

                            inc_records = inc_collect->filter(&inc_q);
                            int inc_records_size = inc_records.size();

                            if (inc_records_size > 0) {
                                auto inc_array = mBridge->createArray();
                                inc_collect->open_reader();
                                if (is_multiple_records) {

                                    vs_utils::extract_records(mBridge, inc_records, inc_array, 0, inc_records_size - 1);
                                    inc_item->putArray(inc_key, inc_array);
                                } else {
                                    vs_utils::extract_records(mBridge, inc_records, inc_array, 0, 1);
                                    inc_item->putMap(inc_key, inc_array->getMap(0));
                                }
                                inc_collect->close_reader();
                            }

                            inc_q.clear();
                        }
                    }
                }


                res->putArray("items", items);
                promise->resolveMap(res);
            }
        }
    }

    void VasernManagerImpl::CountRecordsByQuery(
        const std::string &collection_name,
        const std::shared_ptr<::JavascriptMap> &js_query,
        const std::shared_ptr<::JavascriptPromise> &promise)
    {
        std::shared_ptr<vs::collect_t> collect = database.select(collection_name.c_str());

        if (collect == nullptr)
        {
            promise->reject("no_collection", "Collection does not exist!");
        }
        else
        {

            vs::upair_t query = vs_utils::jsmap_to_query(js_query);

            auto res = mBridge->createMap();
            auto changes = mBridge->createMap();

            changes->putInt("inserted", 0);
            changes->putInt("updated", 0);
            changes->putInt("removed", 0);
            changes->putInt("unchanged", 0);

            res->putMap("changes", changes);
            res->putInt("total", collect->count(&query));

            promise->resolveMap(res);
        }
    }

    void VasernManagerImpl::AllRecords(
        const std::string &collection_name,
        const std::shared_ptr<::JavascriptPromise> &promise)
    {
        std::shared_ptr<vs::collect_t> collect = database.select(collection_name.c_str());

        if (collect == nullptr)
        {
            promise->reject("no_collection", "Collection does not exist!");
        }
        else
        {

            // TODO: get allrecord from collection

            auto res = mBridge->createMap();
            auto changes = mBridge->createMap();
            auto items = mBridge->createArray();

            collect->open_reader();
            auto recordItr = collect->first();
            while(recordItr->is_valid()) {

                if (!recordItr->is_tombstone()) {
                    items->pushMap(vs_utils::upair_to_jsmap(recordItr->object(), mBridge));
                }

                recordItr->next();
            }

            changes->putInt("inserted", 0);
            changes->putInt("updated", 0);
            changes->putInt("removed", 0);
            changes->putInt("unchanged", 0);

            res->putMap("changes", changes);
            res->putString("status", "ok");
            res->putArray("items", items);
            promise->resolveMap(res);
        }
    }
} // namespace vasern