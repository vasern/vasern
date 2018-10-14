// @flow

import { Document } from '../../core/vasern/Document';

export class AuthModel extends Document {

    loggedIn = false;
    user = undefined;
    autoSync = false;

    name = "Auth"

    props = {
        fname: "?string",
        lname: "?string",
        token: "string",
        username: "string"
    }

    constructor(props) {
        super(props);

        if (props.extraProps) {
            this.props = Object.assign(this.props, props.extraProps);
        }
    }


    /** 
     * Login
     */
    async login(username: string, password: string): boolean {

    }

    /** 
     * Add new user
     */
    async createUser(username: string, password: string, extras: object): boolean {

    }

    /** 
     * Logout
     */
    async logout(): boolean {

    }
}