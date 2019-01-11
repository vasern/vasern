#pragma once


#include "VasernManager.hpp"
#include "JobQueueImpl.hpp"
#include "JobDispatcher.hpp"

namespace vasern {
    
    class VasernManagerImpl : public vasern::VasernManager {

    public:
        static std::shared_ptr<VasernManager> create(const std::shared_ptr<::ReactBridge> & bridge);
        VasernManagerImpl(const std::shared_ptr<::ReactBridge> & bridge);
        ~VasernManagerImpl();

        void Startup(
                const std::shared_ptr<::JavascriptMap> & schema,
                const std::shared_ptr<::JavascriptPromise> & promise) override;

        void InsertRecords(
                const std::string & collect,
                const std::shared_ptr<::JavascriptArray> & records,
                const std::shared_ptr<::JavascriptPromise> & callback) override;

        void UpdateRecords(
                const std::string & collect,
                const std::shared_ptr<::JavascriptMap> & records,
                const std::shared_ptr<::JavascriptPromise> & callback) override;

        void DeleteRecords(
                const std::string & collect,
                const std::shared_ptr<::JavascriptArray> & records,
                const std::shared_ptr<::JavascriptPromise> & callback) override;

        void RemoveAllRecords(
                const std::string & collect,
                const std::shared_ptr<::JavascriptPromise> & promise) override;

        void RemoveAllCollections(
                const std::shared_ptr<::JavascriptPromise> & promise) override;

        void GetRecordsByQuery(
                const std::string & collect,
                const std::shared_ptr<::JavascriptMap> & query,
                const std::shared_ptr<::JavascriptPromise> & callback) override;

        void CountRecordsByQuery(
                const std::string & collect,
                const std::shared_ptr<::JavascriptMap> & query,
                const std::shared_ptr<::JavascriptPromise> & callback) override;

        void AllRecords(
                const std::string & collect,
                const std::shared_ptr<::JavascriptPromise> & promise) override;
    private:
        std::shared_ptr<ReactBridge> mBridge;
        std::shared_ptr<JobQueueImpl> mQueue;
        std::shared_ptr<JobDispatcher> mDispatcher;
        
    };
    
}