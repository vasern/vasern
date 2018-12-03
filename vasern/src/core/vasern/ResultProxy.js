// @flow

function createProxy() : Proxy {
    const traps = {
        get: (target, property: any) => {

            return target[property];
        },
        set: (target, property: any, value, receiver) => {

            if (property == "$set") {
                let item, i = target.length;
                for (item in value) {
                    target[i++] = value[item];
                }
            } else {
                target[property] = value;
            }
            return true;
        }
    };

    return new Proxy([], traps);
}

export default createProxy;