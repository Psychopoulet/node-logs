# node-logs
A class to manage logs

[![Build status](https://api.travis-ci.org/Psychopoulet/node-logs.svg?branch=master)](https://travis-ci.org/Psychopoulet/node-logs)
[![Coverage status](https://coveralls.io/repos/github/Psychopoulet/node-logs/badge.svg?branch=master)](https://coveralls.io/github/Psychopoulet/node-logs)
[![Dependency status](https://david-dm.org/Psychopoulet/node-logs/status.svg)](https://david-dm.org/Psychopoulet/node-logs)
[![Dev dependency status](https://david-dm.org/Psychopoulet/node-logs/dev-status.svg)](https://david-dm.org/Psychopoulet/node-logs?type=dev)
[![Issues](https://img.shields.io/github/issues/Psychopoulet/node-logs.svg)](https://github.com/Psychopoulet/node-logs/issues)
[![Pull requests](https://img.shields.io/github/issues-pr/Psychopoulet/node-logs.svg)](https://github.com/Psychopoulet/node-logs/pulls)

> Be careful !!! With this version, the plugin became absolutly agnostic and does not support sqlite anymore. Please refer to [node-logs-sqlite](https://github.com/Psychopoulet/node-logs-sqlite) for that.

## Installation

```bash
$ npm install node-logs
```

## Features

  * Easily manage your logs in the way you want
  * Show logs in the command prompt
  * Add interfaces to use new specific way to log data (api, json, etc...)

## Doc

-- Interfaces --

```typescript
type iOption = "background" | "bold" | "italic" | "strikethrough" | "underline";

interface iInterface {
  log: Function;
  success: Function;
  information: Function;
  warning: Function;
  error: Function;
}
```

-- Constructor --

* ``` constructor () ```

-- Methods --

* -- Accessors --
* ``` showInConsole (showInConsole: boolean): this ``` default false

* -- Init / Release --
* ``` init(): Promise< resolve<void> | reject<Error> > ```
* ``` release(): Promise< resolve<void> | reject<Error> > ```

* -- Interfaces --
* ``` addInterface(interface: iInterface): Promise< resolve<void> | reject< ReferenceError|TypeError|Error > > ``` add your own way to log data

* -- Write logs --
* ``` log(text: any, option?: Array<iOption>) : Promise< resolve<void> | reject<Error> > ```
* ``` success(text: any, option?: Array<iOption>): Promise< resolve<void> | reject<Error> > ``` alias : "ok"
* ``` warning(text: any, option?: Array<iOption>): Promise< resolve<void> | reject<Error> > ``` alias : "warn"
* ``` error(text: any, option?: Array<iOption>): Promise< resolve<void> | reject<Error> > ``` alias : "err"
* ``` information(text: any, option?: Array<iOption>): Promise< resolve<void> | reject<Error> > ``` alias : "info"

## Examples

### Native

```javascript
const Logs = require("node-logs");
const logs = new Logs();
```

```javascript
logs.showInConsole(true);
```

```javascript
// example: link the logger to a Web API
const { request } = require("http");

function _myOwnLogger(type, msg) {

  const req = request({
    "host": "www.myownloger.com",
    "method": "PUT",
    "path": "/api/" + type + "/"
  }, (res) => {

    res.setEncoding("utf8");

    let data = "";
    res.on("data", (chunk) => {
      data += chunk;
    }).on("end", () => {
      console.log(data);
    });

  });

  req.write(String(msg));
  req.end();

}

logs.addInterface({

  "log" : (msg, options) => { _myOwnLogger("log", msg, options); },
  "success" : (msg, options) => { _myOwnLogger("success", msg, options); },
  "information" : (msg, options) => { _myOwnLogger("information", msg, options); },
  "warning" : (msg, options) => { _myOwnLogger("warning", msg, options); },
  "error" : (msg, options) => { _myOwnLogger("error", msg, options); }

}).then(() => {
  console.log("MyOwnLoger added !");
}).catch((err) => {
  console.error(err);
});
```

```javascript
return logs.init().then(() => {

  // you can use the logger in a classical way

  logs.log("log");
  logs.success("success"); logs.ok("ok");
  logs.information("information");
  logs.warning("warning"); logs.warn("warn");
  logs.error("error"); logs.err("err");

  // or with promises if you added an asynchronous interface

  logs.log("log").then(() => {

     return logs.ok("ok").then(() => {
        return logs.success("success");
     });

  }).then(() => {

     return logs.warn("warn").then(() => {
        return logs.warning("warning");
     });

  }).then(() => {

     return logs.err("err").then(() => {
        return logs.error("error");
     });

  }).then(() => {
     return logs.information("information");
  }).catch((err) => {
     console.log(err);
  });

  // you can also add "iOption" style features

  logs.log("log", [ "bold", "underline" ]);

  // release

  logs.release().catch((err) => {
     console.log(err);
  });

});
```

### Typescript

```typescript
import Logs = require("node-logs");
const logs = new Logs();

logs.init().then(() => {
   return logs.log("log");
});
```

## Tests

```bash
$ npm run-script tests
```

## License

  [ISC](LICENSE)
