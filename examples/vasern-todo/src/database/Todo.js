export class TodoModel {

    name = "Todos";
    
    props = {
        name: 'string',
        completed: 'boolean',
        parent: '#Todos'
    }
}