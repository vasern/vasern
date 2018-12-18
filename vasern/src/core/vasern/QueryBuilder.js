import { createProxy } from './ResultProxy';
import toNativeQuery from './utils/toNativeQuery';

// @flow

export default class QueryBuilder {

    constructor(filter: Object, collection) {
        this._query = toNativeQuery(collection.props, filter);
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

    include(props: Array<{ ref: string, refId?: string, toId?: string }>): QueryBuilder {
        let rs = {};
        
        props.forEach((item, i) => {
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
        })

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

    asProxy(): Object {
        var rs = createProxy();
        (async () => {
            let queryResults = await this._collection.nFilter(this._query);
            rs.$set = queryResults.data;
        })();
        return rs;
    }

}

