// @flow

function createProxy() {
    const traps = {
        get: (target, property) => {

            return target[property];
        },
        set: (target, property, value, receiver) => {

            target[property] = value;
            return true;
        }
    };

    var proxy = new Proxy([], traps);

    proxy.setValues = (values: Array<Object>) => {
        values.forEach(item => {
            proxy.push(item);
        });
    }

    return proxy;
}

export default createProxy;