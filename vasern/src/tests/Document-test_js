import React from 'react';
import { NativeModules } from 'react-native';
import Document, { Vasern } from '..';

const Vasern = NativeModules.VasernManager;

class ItemModel extends Document {
    name = "Items";

    props = {
        name: "string",
        duration: "double",
        date: "date"
    };
}

describe("Doc Object", () => {

    var VasernDB = new Vasern({ schemas: [ItemModel] })
    , { Items } = VasernDB;

    test("NativeModule is available", () => {

        Vasern = {
            fetch: jest.fn(),
            store: jest.fn()
        }

    })

    test("Initiate and Load", () => {

        expect(Items).toBeDefined();
        
        expect(Items.props.name).toBe("string")
        expect(Items.props.duration).toBe("double")
        expect(Items.props.date).toBe("date")
    })

    describe("Inserting", () => {
        Items.onLoaded(() => {

            test("Single item", () => {
                var newItem = Items.insert({ name: "Insert test", duration: 0.001, date: Date.now() })
                expect(newItem[0].id).toBeDefined();
            })

            test("Multiple items", () => {

                Items.perform((manager) => {

                    manager.insert([{
                        name: "Multiple items - 1",
                        duration: "0.001",
                        date: Date.now()
                    }, {
                        name: "Multiple items - 2",
                        duration: 0.02,
                        date: "20/06/2018"
                    }])
                })

                expect(Items.length()).toBe(3);
            })
        });
    })

    describe("Find and Update Item", () => {

        var firstItem = Items.get({ name: "Multiple items - 1" });

        test("Find value with object query", () => {

            expect(firstItem).toBeDefined();
        })

        test("Update props", () => {
            var newValues = { name: "Multiple items - first" }
            Items.update({ name: "Multiple items - 1" }, newValues)
            var firstItemUpdated = Items.get(firstItem.id);

            expect(firstItemUpdated.name).toEqual(newValues.name);
        })

    })

    describe('Remove item', () => {
        var firstItem = Items.get({ name: "Multiple items - 1" });

        expect(firstItem).toEqual(null);
    })
})