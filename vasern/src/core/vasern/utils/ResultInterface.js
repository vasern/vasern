
// @flow 
import { createArrayProxy, createObjectProxy } from '../../vasern-querybuilder/ResultProxy';
import Vasern from '../../../..';

type ResultInterface = {
    asProxy: Object,
    asPromise: Promise
}

function createResultInterface(callback: Promise, options: { asArray: boolean, callbackEvent: Function }) : ResultInterface {

    return {
        asPromise: () => {

            return new Promise((resolve, reject) => {
                callback().then(result => {

                    resolve(result);

                    // Fire event trigger
                    if (options.callbackEvent) {
                        options.callbackEvent(result);
                    }
                    
                }).catch(reject);
            })
            
        },
        asProxy: () => {
            let { asArray } = options;
            let rs = asArray ? createArrayProxy() : createObjectProxy();

            callback()
            .then(result => {

                if (asArray) {
                    if (result.items) {
                        rs.$set = result.items;
                    } else {
                        rs.$set = result.item
                    }
                } else {
                    for (let key in result) {
                        rs[key] = result[key];
                    }
                }

                // Fire event trigger
                if (options.callbackEvent) {
                    options.callbackEvent(result);
                }
            })
            .catch(error => {
                rs.status = 'error';
                rs.statusMessage = error.message;
            })

            return rs;
        },
        run: () => {
            callback()
            .then(result => {

                // Fire event trigger
                if (options.callbackEvent) {
                    options.callbackEvent(result);
                }

            })
        }
    }
}

export default createResultInterface;