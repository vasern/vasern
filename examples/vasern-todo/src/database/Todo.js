/**
 * TodoModel 
 * This is a todo model. 
 * Similar models can be created as per usage.
 */
export class TodoModel {

    name = "Todos";
    
    props = {
        name: 'string',
        completed: 'boolean',
        parent: '#Todos'
    }
}