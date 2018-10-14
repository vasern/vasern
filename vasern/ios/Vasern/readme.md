# Vasern Logger

Vasern Logger is a simple logger, was designed as a storage logger for [Vasern (a data storage for React Native)](https://github.com/ambistudio/vasern). _The name Vasern derived from Vase for React Native_.
Available for write, override and load log records from/to a record log file.
It suits small log file size and use .vasern file extension by default.

Vasern Logger is licensed under the Apache License, Version 2.0 (the "License"). Please find "LICENSE" file attached for license details.

## Getting Vasern Logger

The simplest way to get Vasern Logger is to download from Github (#url needed), then place it into your
project. And simply include the header file as 

```cpp
// replace with the actual vasern_logger.hpp file location
#include "vasern_logger.hpp"
```

## How to use Vasern Logger?

Available methods:

1. Before you start

    In order to access available methods, you need to initate a `Logger` instance first. Simply use
    `Logger` constructor that takes a string argument as log file location (to use the current directory, pass in "." as the argument)

    ```cpp
    vasern::Logger db("./dblocation");
    ```

2. Insert log records

    Method: `bool Insert(string doc, vector<string> records, bool cleanMode = false)`

    Where:
    - doc: document name
    - records: a list of records will be written into the log file
    - cleanMode: enable write log in `clean mode`. By default, it set to `false`
    - Return `bool` value indicate the write process was either successful or not

    Note: enable `clean mode` will override existing log file with records, while disabling `clean mode` (meaning using `append mode`) will write/appending records into the end of the log file. (It is recommended to use `clean mode` once in a while to clean up "dead" records)

    Example of insert log records.

    ```cpp
        // Example log records, names from "Family Guys" animated sitcom
        std::vector<std::string> logRecords = {
            "Item1, Peter Griffin, Quahog, Rhode Island",
            "Item2, Lois Griffin, Quahog, Rhode Island",
            "Item3, Brain Griffin, Quahog, Rhode Island",
            "Item4, Chris Griffin, Quahog, Rhode Island",
            "Item5, Meg Griffin, Quahog, Rhode Island",
            "Item6, Stewie Griff, Quahog, Rhode Island"
        }

        bool success = db.Insert("People", logRecords)
    ```

3. Load records log

    Method: `vector<string> Load(string doc);`

    Where:
    - doc: document name
    - Return all records in log file as a `vector<string>`

    ```cpp
        // Load all records from "People" log file
        // Should return a list of records as inserted
        std::vector<std::string> logRecords = db.Load("People")
    ```

## Run test

Vasern Logger use [Catch2](https://github.com/catchorg/Catch2) for unit testing.
A provided test (located at `./tests/vasern_logger_test.cpp`) contains 3 test cases including insert records, load records and insert records in cleanMode. The log file will located at `./dbTest` (if dir not already existed, it should create one)

Run `make test` to see the result. (Require [CMake](https://cmake.org/cmake-tutorial/). It will compile test file located `/tests`, run test and clean up files. )


## Contribute

Vasern Logger is originally created by [@hieunc229](https://github.com/hieunc229) (came from high-level programming language experience).
In case you think anything should and can be improved, feel free to open up an issue / create a pull request.
Your contribution is welcome and highly appriciated