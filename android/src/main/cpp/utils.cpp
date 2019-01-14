#include <JavascriptMap.hpp>
#include <JavascriptMapKeyIterator.hpp>
#include <JavascriptType.hpp>
#include <JavascriptArray.hpp>

#include "utils.hpp"
#include "../../../../ios/Vasern/src/values/value_f.h"

namespace vs_utils {
    vs::upair_t jsmap_to_upair(
        const std::shared_ptr<JavascriptMap> & js_map
    ) {
        vs::upair_t pairs;
        std::string prop_str;
        auto keyItr = js_map->keySetIterator();

        while (keyItr->hasNextKey()) {
            prop_str = keyItr->nextKey();

            switch (js_map->getType(prop_str)) {
                case JavascriptType::STRING:
                    pairs[prop_str] = vs::value_f::create(js_map->getString(prop_str));
                    break;
                case JavascriptType::NUMBER:
                    pairs[prop_str] = vs::value_f::create(js_map->getDouble(prop_str));
                    break;
                case JavascriptType::BOOLEAN:
                    pairs[prop_str] = vs::value_f::create(js_map->getBoolean(prop_str));
                    break;
                case JavascriptType::MAP:
                    pairs[prop_str] = vs::value_f::create(jsmap_to_upair(js_map->getMap(prop_str)));
                    break;
                case JavascriptType::ARRAY:
                    pairs[prop_str] = vs::value_f::create(jsarray_to_ulist(js_map->getArray(prop_str)));
                    break;
                default:
                    break;
            }
        }

        return pairs;
    }
    
    vs::ulist_t jsarray_to_ulist(
       const std::shared_ptr<JavascriptArray>& js_array
    ) {
        vs::ulist_t list;
        
        for (int i = 0; i < js_array->size(); i++) {

            switch (js_array->getType(i)) {
                case JavascriptType::STRING:
                    list.push_back(vs::value_f::create(js_array->getString(i)));
                    break;
                case JavascriptType::NUMBER:
                    list.push_back(vs::value_f::create(js_array->getDouble(i)));
                    break;
                case JavascriptType::BOOLEAN:
                    list.push_back(vs::value_f::create(js_array->getBoolean(i)));
                    break;
                case JavascriptType::MAP:
                    list.push_back(vs::value_f::create(jsmap_to_upair(js_array->getMap(i))));
                    break;
                case JavascriptType::ARRAY:
                    list.push_back(vs::value_f::create(jsarray_to_ulist(js_array->getArray(i))));
                    break;
                default:
                    break;
            }

        }

        return list;
    };

    vs::value_t* get_value(JavascriptType js_type, std::shared_ptr<JavascriptMap> & js_map, bool as_range) {
        
        switch (js_type) {
            case JavascriptType::STRING:
                return vs::value_f::create(js_map->getString("equal"));
            case JavascriptType::NUMBER:
                if (as_range) {
                    return vs::value_f::create(js_map->getDouble("start"), js_map->getDouble("end"));
                }
                return vs::value_f::create(js_map->getDouble("equal"));
            case JavascriptType::BOOLEAN:
                return vs::value_f::create(js_map->getBoolean("equal"));
            default:
                break;
        }

        // TODO: error handling
        return NULL;
    }

    vs::upair_t jsmap_to_query(
        const std::shared_ptr<JavascriptMap> & js_map
    ) {
        vs::upair_t rs;
        std::string prop_str;
        auto keyItr = js_map->keySetIterator();

        JavascriptType value_type;

        std::shared_ptr<JavascriptMap> prop_cmp;
        bool as_range;

        while (keyItr->hasNextKey()) {
            prop_str = keyItr->nextKey();
            prop_cmp = js_map->getMap(prop_str);
            as_range = prop_cmp->hasKey("start");

            if (as_range) {
                value_type = prop_cmp->getType("start");
            } else {
                value_type = prop_cmp->getType("equal");
            }

            rs[prop_str] = get_value(value_type, prop_cmp, as_range);

        }

        return rs;
    }

    std::vector<const char*> to_vector(const std::shared_ptr<::JavascriptArray> & js_array) {
        std::vector<const char*> rs;
        
        for (int i = 0; i < js_array->size(); i++) {
            rs.push_back(js_array->getString(i).c_str());
        }

        return rs;
    }

    std::unordered_map<std::string, vs::layout_t> to_database_model(
        const std::shared_ptr<::JavascriptMap> & js_model
    ) {
        std::unordered_map<std::string, vs::layout_t> model;

        std::string col_str, prop_str;
        std::shared_ptr<JavascriptMap> col_model, prop_map;
        std::shared_ptr<JavascriptMapKeyIterator> keyItr, col_keys;

        vs::type_desc_t prop_type;

        keyItr = js_model->keySetIterator();

        while(keyItr->hasNextKey()) {
            col_str = keyItr->nextKey();
            col_model = js_model->getMap(col_str);
            col_keys = col_model->keySetIterator();

            vs::schema_t schema;

            while (col_keys->hasNextKey()) {

                prop_str = col_keys->nextKey();

                prop_map = col_model->getMap(prop_str);
                prop_type = static_cast<vs::type_desc_t>(prop_map->getInt("type"));

                if (prop_type == vs::STRING) {
                    schema.push_back(vs::col_t(prop_str, prop_type, prop_map->getInt("size")));
                } else {
                    schema.push_back(vs::col_t(prop_str, prop_type));
                }

            }

            model[col_str] = vs::layout_t(schema, 1024);
        }

        return model;
    };

    std::shared_ptr<JavascriptMap> upair_to_jsmap(vs::upair_t pairs, std::shared_ptr<ReactBridge> & mBridge) {
        std::shared_ptr<JavascriptMap> rs = mBridge->createMap();

        for (auto itr: pairs) {
            switch (itr.second->type) {
                case vs::STRING:
                    rs->putString(itr.first, itr.second->str_value());
                    break;
                    
                case vs::NUMBER:
                    rs->putDouble(itr.first, itr.second->number_value());
                    break;
                    
                case vs::BOOLEAN:
                    rs->putBoolean(itr.first, itr.second->bool_value());
                    break;
                    
                case vs::LIST:
                    rs->putArray(itr.first, ulist_to_jsarray(itr.second->list_values(), mBridge));
                    break;
                    
                case vs::OBJECT:
                    rs->putMap(itr.first, upair_to_jsmap(itr.second->object(), mBridge));
                    break;
                default:
                    break;
            }
        }

        return rs;
    }

    std::shared_ptr<JavascriptArray> ulist_to_jsarray(vs::ulist_t pairs, std::shared_ptr<ReactBridge> & mBridge) {
        std::shared_ptr<JavascriptArray> rs = mBridge->createArray();

        for (auto itr: pairs) {
            switch (itr->type) {
                case vs::STRING:

                    rs->pushString(itr->str_value());
                    break;
                    
                case vs::NUMBER:
                    rs->pushDouble(itr->number_value());
                    break;
                    
                case vs::BOOLEAN:
                    rs->pushBoolean(itr->bool_value());
                    break;
                    
                case vs::LIST:
                    rs->pushArray(ulist_to_jsarray(itr->list_values(), mBridge));
                    break;
                    
                case vs::OBJECT:
                    rs->pushMap(upair_to_jsmap(itr->object(), mBridge));
                    break;

                default:
                    break;
            }
        }

        return rs;
    }

    void extract_records(
        std::shared_ptr<ReactBridge> & mBridge,
        std::vector<vs::block_reader*> ptrs,
        std::shared_ptr<JavascriptArray> & records
    ) {
        for (auto & itr: ptrs) {
            records->pushMap(upair_to_jsmap(itr->object(), mBridge));
        }
    }

    void extract_records(
        std::shared_ptr<ReactBridge> & mBridge,
        std::vector<vs::block_reader*> ptrs,
        std::shared_ptr<JavascriptArray> & records,
        int start,
        int end
    ) {

        if (end == -1 || end > (int)ptrs.size() - 1) {
            end = ptrs.size() - 1;
        }

        for (int i = start; i < end; i++) {
            records->pushMap(upair_to_jsmap(ptrs.at(i)->object(), mBridge));
        }
    }
}