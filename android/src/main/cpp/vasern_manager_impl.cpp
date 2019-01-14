#include "vasern_manager_impl.hpp"
#include <string>
#include <JavascriptMapKeyIterator.hpp>

#include "../../../../ios/Vasern/src/values/value_f.h"

#include <android/log.h>
namespace vasern
{

std::shared_ptr<VasernManager> VasernManager::create(const std::shared_ptr<::ReactBridge> &bridge)
{
	return std::make_shared<VasernManagerImpl>(bridge);
}

VasernManagerImpl::VasernManagerImpl(const std::shared_ptr<::ReactBridge> &bridge)
	: mBridge(bridge)
{
	mQueue = JobQueueImpl::create();
	mDispatcher = mBridge->createJobDispatcher(mQueue);
	mDispatcher->start();
}

VasernManagerImpl::~VasernManagerImpl()
{
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

	// TODO: check get number of keys
	if (!database.verify_collections(total_keys))
	{
		auto model = vs_utils::to_database_model(schema);
		database.setup(model);
	}

	auto res = mBridge->createMap();
	res->putString("status", "ok");
	promise->resolveMap(res);
}

void VasernManagerImpl::InsertRecords(
	const std::string &collect,
	const std::shared_ptr<::JavascriptArray> &records,
	const std::shared_ptr<::JavascriptPromise> &promise)
{
	auto coll = database.select(collect.c_str());
	if (coll != nullptr)
	{

		size_t total = 0;
		coll->open_writer();
		vs::upair_t r_pairs;

		for (int i = 0; i < records->size(); i++)
		{

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
	}
	else
	{
		promise->reject("no_collection", "Collection does not exist!");
	}
}

void VasernManagerImpl::UpdateRecords(
	const std::string &collect,
	const std::shared_ptr<::JavascriptMap> &records,
	const std::shared_ptr<::JavascriptPromise> &promise)
{
	auto coll = database.select(collect.c_str());

	if (coll == nullptr)
	{
		promise->reject("no_collection", "Collection does not exist!");
	}
	else
	{

		// TODO: go throw each record and update
		coll->open_writer_update();
		auto keyItr = records->keySetIterator();
		std::string prop;
		vs::upair_t updated_props;

		if (keyItr->hasNextKey())
		{
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

	if (collect == nullptr)
	{
		promise->reject("no_collection", "Collection does not exist!");
	}
	else
	{

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

void VasernManagerImpl::GetRecordsByQuery(
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
		auto items = mBridge->createArray();

		changes->putInt("inserted", 0);
		changes->putInt("updated", 0);
		changes->putInt("removed", 0);
		changes->putInt("unchanged", 0);

		res->putMap("changes", changes);
		res->putInt("total", collect->count(&query));
		res->putArray("items", items);
		promise->resolveMap(res);
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