/* ===============================================================
//
//  Copyright by Ambi Studio 2018
//  Licensed under the Apache License, Version 2.0 (the "License");
//  (Please find "LICENSE" file attached for license details)
//============================================================= */

// @arguments: array of string message
function err(...args) {
  console.log("%cReceive Error/s:", "background: #222; color: #bada55");
  Array.from(args).forEach(error => {
    console.log(
      `%c: ${error.fileName}, line ${error.lineNumber}: ${error}`,
      "color: red"
    );
  });
}

function warn(...args) {
  console.log("%cReceive Warning/s:", "background: #222; color: #bada55");
  Array.from(args).forEach(error => {
    if (err) {
      console.log(
        `%c: ${error.fileName}, line ${error.lineNumber}: ${error}`,
        "color: orange"
      );
    }
  });
}

const Reporter = {
  err,
  warn,
};

export default Reporter;
