// @flow
export default class AuthModel {
  // login status
  loggedIn = false;

  // user object
  user = undefined;

  // enable sync to server
  autoSync = false;

  // model name
  name = "Auth";

  props = {
    fname: "?string",
    lname: "?string",
    token: "string",
    username: "string",
  };

  constructor(props) {
    if (props.extraProps) {
      this.props = Object.assign(this.props, props.extraProps);
    }
  }

  /**
   * Login
   */
  async login(username: string, password: string): boolean {}

  /**
   * Add new user
   */
  async createUser(
    username: string,
    password: string,
    extras: object
  ): boolean {}

  /**
   * Logout
   */
  async logout(): boolean {}
}
