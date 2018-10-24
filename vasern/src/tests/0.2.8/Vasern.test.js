import { NativeModules } from 'react-native';
import Vasern from '../../../index';

// Setup mocks, NativeModules not accesible when using jest
jest.mock('NativeModules', () => {
    return {
        VasernManager: {
            Request: jest.fn(),
            Insert: jest.fn()
        }
    };
});

const TodoModel = {
    name: "TodoItems",
    props: {
        name: "string",
        dueOn: "datetime",
        assignTo: "[]#Users"
    }
}
,   UserModel = {
    name: "Users",
    props: {
        fname: "string",
        lname: "string",
        yob: "int"
    }
}
, VasernDB = new Vasern({ schemas: [TodoModel, UserModel] })
, { TodoItems, Users } = VasernDB;

describe("Setup Vasern Object", () => {

    test("Vasern initates TodoModel and UserModel", () => {

        // TODO: setup up this test using VasernDB.onLoaded and use test callback "done"

        expect(TodoItems).toBeDefined();
        expect(Users).toBeDefined();
        expect(VasernDB.docs.length).toEqual(2);
    });
});

describe("Insert records", () => {

    let Peter;

    test("Record without reference prop", () => {
        
        Peter = Users.insert({
            fname: "Peter",
            lname: "Griffin",
            yob: 1960
        })[0];
        
        // TODO: Update jest NativeModules mock for inserting
        // Peter = Users.get({ fname: "Peter" });

        // expect(Peter).toBeDefined();
    })

    test("Record with reference prop", () => {

        // due datetime, same time tomorrow
        const duedate = new Date();
        duedate.setDate(duedate.getDate() + 1);

        const todoItem = TodoItems.insert({
            name: "Smash",
            dueOn: duedate,
            assignTo: [Peter]
        });

        expect(todoItem.length).toEqual(1);
    })
})

describe("Test functions", () => {

    
    test("List document and reference", () => {

        // TODO: setup up this test using VasernDB.onLoaded and use test callback "done"

        let todoList = VasernDB.list("TodoItems");
        // expect(todoList.count()).toEqual(1);

        let PeterTodoList = todoList.get({ fname: "Peter", lname: "Griffin" });
        // expect(PeterTodoList).toBeDefined();

        // expect(PeterTodoList.assignTo[0].fname).toEqual("Peter");
    });
})