
# A list of desirable queries

## Structure

    Vasern 
    |__ Document (inherit from Queryable)

## Use case and terms used

1. Example use case

    Silicon Valley Startups             (Vasern     - called SVStartups)

    --> Product Markets                 (Document   - called ProductMarkets)
    --> Products                        (Document   - called Products)
        + has one Product Maket         (reference  - called #ProductMarket)
    --> Startups                        (Document   - called Startups)
        + has one to many Products      (reference  - called #Product)

2. Terms used

    - `hot object`: an object received right after calling `create` method but has not been stored. In most cases, it is safe to use. But if the `storing data process` is failed, which rarely happend, it became invalid (probably id will be change).

## Queries

### Vasern object

1. Get object

    Get object(s) from `Vasern` will return its variables and also the referenced object.
    For example, get a `#Product` object will return a `#Product object` include its variables and a `#ProductMarket` object.

    ```
    Query: `SVStartups.object("Product", "${productId}")`
    Return: `#Product{object}`
    ```
### Document object

Each `Document` object will contain an `id` which is auto generated, and following the format 
`${Date.now()}-${random 5 chars}-${random 5 chars}`

1. Create object

    Creating an object from `Document` that has a referenced object will automatically replaced by its `id`
    before being stored. (You can either passin referenced object as object or its `id`).

    Query: `Products.create(#Product<object>)`
    Return: `#Product<object>` (this is a hot object)

2. Get object(s)

    Get object(s) from `Document` will return its variables, and the referenced object id.
    ```
    (from Document class)
    Query: `Products.object("${productId}")`
    Return: `#Product{object}`
    ```
3. Find object(s) by `propertyName: value`

    Find single object
    ```
    (from Queryable class)
    Query: `Products.find({ propertyName: value })`
    Return: `#Product{object}`
    ```

    Find multiple objects
    ```
    (from Queryable class)
    Query: `Products.findAll({ propertyName: value })`
    Return: `Queryable object that contains Array<#Product{object}>`
    ```
4. Remove object(s)

    Remove single object
    ```
    Query: `Products.remove("${productId}")`
    Return: `boolean`
    ```

    Remove multiple objects
    ```
    Query: `Products.removeAll(Array<#Product{object}>)`
    Return: `boolean`
    ```

+ filter, sorting