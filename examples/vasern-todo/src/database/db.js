/**
 * Importing Vasern library to create the Database.
 */
import Vasern from 'vasern';

// Import schemas
/**
 * Import Models in here.
 * {} Curly braces has to be used if models are not export default.
 */
import { TodoModel } from './Todo';

/**
 * Creating Instance of Vasern DB.
 * Providing all the models that are imported above as Schema to the instance.
 */
export default new Vasern({ 
    schemas: [TodoModel]
});
