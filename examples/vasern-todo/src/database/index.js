/**
 * Importing instance of the Created Vasern Database
 */
import VasernDB from './db';

/**
 * Destructuring the necessary DB Schema to be used in the Application
 */
const { Todos } = VasernDB;

/**
 * Exporting VasernDB as default instance.
 * Exporting Schemas for usage in the Application.
 * These exported options can be imported anywhere in the Application to use.
 * This can act as single Instance as reference and different parts of it used wherever needed.
 */
export default VasernDB;
export {
    Todos
}