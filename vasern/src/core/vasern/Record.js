//================================================================
//
//  Copyright by Ambi Studio 2018
//  Licensed under the Apache License, Version 2.0 (the "License");
//  (Please find "LICENSE" file attached for license details)
//================================================================

export class Record {

    constructor(data) {
        var keys = Object.keys(data);
        keys.forEach(k => {
            Object.defineProperty(this, k, {
                value: data[k],
                writable: false // immutate prop
            })
        })
    }

    createdDate() {
        return new Date(this.id.split("-")[0]);
    }
}