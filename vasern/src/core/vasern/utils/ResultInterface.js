
// @flow 
import ResultProxy from '../../vasern-querybuilder/ResultProxy';

type ResultInterfaceType = {
    asProxy: Object,
    asPromise: Promise,
    run: Function,
    subscribe: Function
}
type ResultInterfaceOpts = {
    callback: Function,
    preResult?: Object,
    eventEmitter?: Function
};

export default function ResultInterface (
    action: Promise, 
    options: ResultInterfaceOpts
) : ResultInterfaceType {

    return {
        asPromise: function() {

            return new Promise((resolve, reject) => {
                action().then(result => {

                    resolve(result);

                    // Fire event trigger
                    if (options.callback) {
                        options.callback(result);
                    }
                    
                }).catch(reject);
            })
            
        },
        asProxy: function() {
            return ResultProxy(action, options)
        },
        run: function() {
            action()
            .then(result => {

                // Fire event trigger
                if (options.callback) {
                    options.callback(result);
                }

            })
        },
        on: function(event: "change" | "insert" | "remove" | "update" = "change", callback) {
            options.eventEmitter(event, () => {
                action().then(callback);
            }, { immediateTrigger: true });
        }
    }
}