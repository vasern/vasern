import Document from 'vasern';

export class TodoModel extends Document {

    name = "Todos";
    
    props = {
        name: 'string',
        completed: 'boolean',
        parent: '#Todos'
    }
}