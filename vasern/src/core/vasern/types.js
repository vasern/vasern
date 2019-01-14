import { typeEnums } from "./enums";
import { OBJECTID_LEN } from "../vasern-objectid";

// @flow

type PropertyObject = {
    type: number,
    isIndex: boolean,
    size?: number,
    propMeta?: string
};

function primary(): PropertyObject {
    return {
        type: typeEnums.string,
        size: OBJECTID_LEN,
        isIndex: true
    };
}

function string(length: number = -1, isIndex: boolean = true) : PropertyObject {
    
    var rs : PropertyObject = {
        type: typeEnums.string,
        size: length,
        isIndex: isIndex
    };

    if (length === -1) {
        rs.isIndex = false;
    }

    return rs;
}

function number(isIndex: boolean = true) : PropertyObject {
    var rs : PropertyObject = {
        type: typeEnums.number,
        isIndex: isIndex
    }

    return rs;
}

function boolean(isIndex: boolean = true) : PropertyObject {
    var rs : PropertyObject = {
        type: typeEnums.boolean,
        isIndex: isIndex
    }

    return rs;
}

function ref(name: string) : PropertyObject {

    var rs : PropertyObject = {
        type: typeEnums.string,
        size: OBJECTID_LEN,
        isIndex: true,
        relate: name
    }

    return rs;
}

// Not working yet
function datetime(isIndex: boolean = true) : PropertyObject {

    var rs : PropertyObject = {
        type: typeEnums.number,
        isIndex: isIndex
    }

    return rs;
}

// Not working yet
function enums(enums: Array<string>, isIndex: boolean = true) : PropertyObject {

    var rs : PropertyObject = {
        type: typeEnums.number,
        isIndex: isIndex
    }
    
    return rs;
}

const types = {
    primary,
    string,
    number,
    boolean,
    ref,
    datetime,
    enums
}

export default types;