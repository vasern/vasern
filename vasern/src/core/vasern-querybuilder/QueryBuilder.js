import { createProxy } from './ResultProxy';
import toNativeQuery from './toNativeQuery';

// @flow

export default class QueryBuilder {

    constructor(filter: Object, collection, singleMode = false) {
        this._query= {
            $filter: toNativeQuery(collection.props, filter)
        }
        this._queryType = 'get';
        this._collection = collection;
        this._singleMode = singleMode;
    }

    limit(max: number): QueryBuilder {
        this._query.$limit = max;
        return this;
    }

    paging(max: number, page = 0): QueryBuilder {
        this._query.$paging = { max, page };
        return this;
    }

    include(): QueryBuilder {
        let rs = {};
        for (let item of arguments) {

            if (typeof(item) == "string") {
                rs[item] = {
                    relate: this._collection.props[item].relate,
                    refField: item
                }
            } else {
                for (let key in item) {
                    rs[key] = item[key]
                }
            }
        };

        this._query.$include = rs;
        return this;
    }

    sort(): QueryBuilder  {
        let attrs = new Array(arguments.length);
        arguments.forEach((attr, i) => {
            attrs[i] = attr;
        })
        this._query.$sort = attrs;
        return this;
    }

    asPromise(): Promise {
        return this._collection.nFilter(this._query);
    }

    subscribe(event: "change" | "insert" | "remove" | "update" = "change"): Promise {

        var promise = new Promise(function(resolve, reject) {
            
            this._collection.on(event, () => {
                this._collection.nFilter(this._query)
                .then(result => {
                    resolve(result);
                })
                .catch(error => {
                    reject({ status: 'error', statusMessage: error.message });
                });
            });
            
            this._collection.nFilter(this._query)
            .then(result => {
                resolve(result);
            })
            .catch(error => {
                reject({ status: 'error', statusMessage: error.message });
            });

        });

        
        return promise;
    }

    asProxy(): Object {
        var rs = createProxy({ singleMode: this._singleMode });
        
        this._collection.nFilter(this._query)
        .then(result => {
            rs.$set = result.items;
        })
        .catch(error => {
            rs.status = 'error';
            rs.statusMessage = error.message;
        });
            
        return rs;
    }

}

