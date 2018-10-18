import Vasern from 'vasern';

// Import schemas
import { TodoModel } from './Todo';


export default new Vasern({ 
    schemas: [TodoModel]
});
