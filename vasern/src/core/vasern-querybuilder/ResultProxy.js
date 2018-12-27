// @flow

type ResultInterface = {
    status: 'ok' | 'warning' | 'error' | 'unknown',
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
const traps = {
    get: (target, property) => {
        return target[property];
    },
    set: (target, property, value, receiver) => {

        if (property === "$set" && Array.isArray(value)) {
            value.forEach((item, index) => {
                target[index] = item;
            })

        } else {
            target[property] = value;
        }
        
        return true;
    }
};

function createArrayProxy() : Array<Object> {

    return new Proxy([], traps);
}

function createObjectProxy() : Object {
    return new Proxy({ }, traps);
}

export {
    createArrayProxy,
    createObjectProxy
}