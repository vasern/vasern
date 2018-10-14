//================================================================
//
//  Copyright by Ambi Studio 2018
//  Licensed under the Apache License, Version 2.0 (the "License");
//  (Please find "LICENSE" file attached for license details)
//================================================================

// @arguments: array of string message
function err() {
    console.log('%cReceive Error/s:', 'background: #222; color: #bada55');
    Array.from(arguments).forEach(err => {
        console.log(`%c: ${err.fileName}, line ${err.lineNumber}: ${err}`, 'color: red')
    })
}

function warn() {
    console.log('%cReceive Warning/s:', 'background: #222; color: #bada55');
    Array.from(arguments).forEach(err => {
        if (err) {
            console.log(`%c: ${err.fileName}, line ${err.lineNumber}: ${err}`, 'color: orange')
        }
    })
}

function tryRun(fn, data) {
    try {
        fn();
    } catch(e) {
        warn(e, data);
    }
}

const Reporter = {
    err,
    warn,
    tryRun
}
export {
    Reporter
}