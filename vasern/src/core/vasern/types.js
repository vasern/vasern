import { typeEnums } from "./enums";
import { OBJECTID_LEN } from "../../plugins/vasern-objectid";

// @flow

type PropertyObject = {
    name: number,
    isIndex: boolean,
    size?: number
};

function string(length: number = -1, isIndex: boolean = false) : PropertyObject {
    
    var rs : PropertyObject = {
        name: typeEnums.string,
        size: length,
        isIndex: isIndex
    };

    return rs;
}

function number(isIndex: boolean) : PropertyObject {
    var rs : PropertyObject = {
        name: typeEnums.number,
        isIndex: isIndex
    }

    return rs;
}

function boolean(isIndex: boolean) : PropertyObject {
    var rs : PropertyObject = {
        name: typeEnums.boolean,
        isIndex: isIndex
    }

    return rs;
}

function ref(name: string) : PropertyObject {

    var rs : PropertyObject = {
        name: typeEnums.string,
        size: OBJECTID_LEN,
        isIndex: true
    }

    return rs;
}

function datetime(isIndex: boolean) : PropertyObject {

    var rs : PropertyObject = {
        name: typeEnums.number,
        isIndex: isIndex
    }
}

const types = {
    string,
    number,
    boolean,
    ref,
    datetime
}

export default types;