import { NativeModules } from 'react-native';
import { Document } from '../../../index';

// Setup mocks, NativeModules not accesible when using jest
jest.mock('NativeModules', () => {
    return {
        VasernManager: {
            Request: jest.fn(),
            Insert: jest.fn()
        }
    };
});

// constraits variable, to ensure value consistency through out tests
const singleItemName = "Test item, a random string";
const item1Name = "Multiple item, mambo number 1";
const item2Name = "Multiple item, mambo number 2";
const item1UpdateName = "Multiple item, mambo number fah"

// ================================
// Setup Document and data storage
// ================================

class ItemModel {
    name = "Items";
    props = {
        name: "string",
        duration: "double",
        date: "date"
    };
}
const Items = new Document(ItemModel);
Items.load();

// END: Setup

describe("Setup Document Object", () => {

    // This test is not requried
    test("NativeModule is available", () => {
        NativeModules.Vasern = {
            Insert: jest.fn(),
            Request: jest.fn()
        }
    });


    test("Test Items model is initiated and contains valid props", () => {

        expect(Items).toBeDefined();
        expect(Items.props.name).toBe("string")
        expect(Items.props.duration).toBe("double")
        expect(Items.props.date).toBe("date")
    })
})

describe("Insert Items", () => {

    test("Single item", () => {
        Items.onLoaded(() => {
            var newItem = Items.insert({ 
                name: singleItemName, 
                duration: 0.001, 
                date: Date.now()
            })
            expect(newItem[0].id).toBeDefined();
        })
    })

    test("Multiple items", () => {
        Items.onLoaded(() => {
            Items.perform((manager) => {

                manager.insert([{
                    name: item1Name,
                    duration: "0.001",
                    date: Date.now()
                }, {
                    name: item2Name,
                    duration: 0.02,
                    date: "20/06/2018"
                }])
            })

            expect(Items.length()).toBe(3);
        })
    })
});

describe("Find and Update Item", () => {

    test("Find value with object query", () => {
        Items.onLoaded(() => {
            var firstItem = Items.find({ name: item1Name });
            expect(firstItem).toBeDefined();
            expect(firstItem.name).toEqual(item1Name);
        })
    })

    test("Update props", () => {
        Items.onLoaded(() => {
            var newDateTime = Date.now();
            var newValues = { 
                name: item1UpdateName,
                date: newDateTime
            }
            Items.update({
                name: item1Name },
                newValues
            );
            var foundUpdatedItem = Items.get(firstItem.id);
            
            // Match item found with updated string name
            expect(foundUpdatedItem.name).toEqual(item1UpdateName);

            // Match item date with updated date value
            expect(foundUpdatedItem.date).toEqual(newDateTime);
        })
    })

})

describe('Remove item', () => {

    test("Remove items", () => {
        Items.onLoaded(() => {
            var firstItem = Items.remove({ name: item2Name });

            expect(firstItem.length).toEqual(1);

            var foundItem = Items.get({ name: item2Name })
            expect(foundItem).toEqual(null);
        })
    });
})

describe("Document functions", () => {

    test("import other class", () => {

        class MockupClass {

            static methods = ['getTestFunction']
            mockupName = "mockupItem"
            getTestFunction() {
                return this.mockupName;
            }
        }

        Document.import(MockupClass);

        expect(Document.prototype.getTestFunction).toBeDefined();
        expect(Items.getTestFunction).toBeDefined();
    });

    test("inject plugin", () => {

        class ItemPlugin {
            getTotalRecords() {
                return this._data.length;
            }
        }

        Items.inject(ItemPlugin);

        expect(Items.getTotalRecords()).toBe(Items.length());
    })
})