// @flow

type ResultInterface = {
    status: 'ok' | 'warning' | 'error' | 'unknown' | 'saving'  | 'inserting' | 'updating' | 'processing',
    statusMessage?: string,
    items?: Array<Object>,
    item?: Object,
    changes?: {
        deleted: number,
        updated: number,
        inserted: number,
        unchanges: number
    },
    count?: number
}

type ProxyOptions = { 
    preResult: Object, 
    callback?: Function
};

const traps = {
    get: (target, property) => {
        return target[property];
    },
    set: (target, property, value, receiver) => {
        target[property] = value;
        return true;
    }
};

export default function ResultProxy(action: Promise, options: ProxyOptions) : Array<Object> {
    let { preResult, callback } = options;
    
    if (!preResult) {
        preResult = [];
    }
    
    preResult.first = function() {
        return preResult.items.length ? preResult.items[0] : undefined
    };
    let proxy = new Proxy(preResult, traps);

    action()
    .then(result => {
        Object.assign(proxy, result);
        // Fire event trigger
        if (callback) {
            callback(proxy);
        }
    })
    .catch(error => {
        proxy.status = 'error';
        proxy.statusMessage = error.message;
    })

    return proxy;
}