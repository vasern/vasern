# Vasern Storage

Vasern Storage is a storage engine for [Vasern - fast and open source data storage for React Native](https://github.com/ambistudio/vasern) (for iOS). It's used for write, override and load log records from/to a log file (with extension .vasern by default).

Vasern Storage is licensed under the Apache License, Version 2.0 (the "License"). Please find "LICENSE" file attached for license details.

## Getting started

The simplest way to get Vasern Storage is to [download from Github](https://github.com/ambistudio/vasern/tree/master/ios/Vasern/ios), then place it into your project. And simply includes the header file as:

```cpp
// replace with the actual vasern_logger.hpp file location
#include "vasern_mmap_logger.h"
```

## How to use Vasern Logger?

Available methods:

1. Before you start

    In order to access available methods, you need to initate a `vasern::Storage` instance first. Simply use
    `vasern::Storage` constructor that takes a string argument as log file location (to use the current directory, pass in "." as the argument)

    ```cpp
    vasern::Storage db("./dblocation");
    ```

2. Insert log records

    Method: `bool Insert(const char *docname, NSArray *chunk, bool cleanMode)`

    Where:
    - Arguments:
        - docname: document name
        - chunk: an NSArray of NSString of records will be written into the log file
        - cleanMode: enable write log in `clean mode`. By default, it set to `false`
    - Return `bool` value indicate the write process was either successful or not

    Note: enable `clean mode` will override existing log file with records, while disabling `clean mode` (meaning using `append mode`) will write/appending records into the end of the log file. (It is recommended to use `clean mode` once in a while to clean up "dead" records)

    Example of insert log records.

    ```cpp
        // Example log records, names from "Family Guys" animated sitcom
        NSArray *logRecords = @[
            @"Item1, Peter Griffin, Quahog, Rhode Island",
            @"Item2, Lois Griffin, Quahog, Rhode Island",
            @"Item3, Brain Griffin, Quahog, Rhode Island",
            @"Item4, Chris Griffin, Quahog, Rhode Island",
            @"Item5, Meg Griffin, Quahog, Rhode Island",
            @"Item6, Stewie Griff, Quahog, Rhode Island"
        ];

        bool success = db.Insert("People", logRecords, false)
    ```

3. Load records log

    Method: `NSArray* Load(const char* doc);`

    Where:
    - doc: document name
    - Return a pointer of all records in log file as a `NSArray`

    ```cpp
        // Load all records from "People" log file
        // Should return a list of records as inserted
        NSArray* logRecords = db.Load("People")
    ```

## Run test

TODO:
 - Create tests


## Feedback, Help and Contribute

Please visit [Feedback and Feedback](https://github.com/ambistudio/vasern#help-and-feedback) or [Contribute to Vasern](https://github.com/ambistudio/vasern#contribute-to-vasern) for more details.