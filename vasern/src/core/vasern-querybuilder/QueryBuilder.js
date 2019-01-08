import ResultProxy from './ResultProxy';
import toNativeQuery from './toNativeQuery';

// @flow

export default class QueryBuilder {

    constructor(filter: Object, collection) {
        this._query= {
            $filter: toNativeQuery(collection.props, filter)
        }
        this._queryType = 'get';
        this._collection = collection;
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

    on(event: "change" | "insert" | "remove" | "update" = "change", callback: Function): void {

        this._collection.on(event, () => {
            this._collection.nFilter(this._query)
            .then(callback)
            .catch(callback);
        });
    }

    asProxy(): Object {
        return ResultProxy(() => this._collection.nFilter(this._query));
    }

}

