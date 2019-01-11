#include "vasern_manager_impl.hpp"
#include <string>
 
namespace vasern {

    std::shared_ptr<VasernManager> VasernManager::create(const std::shared_ptr<::ReactBridge> & bridge) {
        return std::make_shared<VasernManagerImpl>(bridge);
    }
    
    VasernManagerImpl::VasernManagerImpl(const std::shared_ptr<::ReactBridge> & bridge)
            : mBridge(bridge) {
        mQueue = JobQueueImpl::create();
        mDispatcher = mBridge->createJobDispatcher(mQueue);
        mDispatcher->start();
    }

    VasernManagerImpl::~VasernManagerImpl() {
        mDispatcher->quit();
    }

    void VasernManagerImpl::Startup(
            const std::shared_ptr<::JavascriptMap> & schema,
            const std::shared_ptr<::JavascriptPromise> & promise) {
        auto res = mBridge->createMap();
        res->putString("status","ok");
        promise->resolveMap(res);
    }

    void VasernManagerImpl::InsertRecords(
            const std::string & collect,
            const std::shared_ptr<::JavascriptArray> & records,
            const std::shared_ptr<::JavascriptPromise> & callback) {
        // Insert Records
    }

    void VasernManagerImpl::UpdateRecords(
            const std::string & collect,
            const std::shared_ptr<::JavascriptMap> & records,
            const std::shared_ptr<::JavascriptPromise> & callback) {

    }

    void VasernManagerImpl::DeleteRecords(
            const std::string & collect,
            const std::shared_ptr<::JavascriptArray> & records,
            const std::shared_ptr<::JavascriptPromise> & callback) {

    }

    void VasernManagerImpl::RemoveAllRecords(
            const std::string & collect,
            const std::shared_ptr<::JavascriptPromise> & promise) {

    }

    void VasernManagerImpl::RemoveAllCollections(
            const std::shared_ptr<::JavascriptPromise> & promise) {

    }

    void VasernManagerImpl::GetRecordsByQuery(
            const std::string & collect,
            const std::shared_ptr<::JavascriptMap> & query,
            const std::shared_ptr<::JavascriptPromise> & callback) {

    }

    void VasernManagerImpl::CountRecordsByQuery(
            const std::string & collect,
            const std::shared_ptr<::JavascriptMap> & query,
            const std::shared_ptr<::JavascriptPromise> & callback) {

    }

    void VasernManagerImpl::AllRecords(
            const std::string & collect,
            const std::shared_ptr<::JavascriptPromise> & promise) {

    }
}