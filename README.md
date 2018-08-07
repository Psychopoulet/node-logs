# node-logs
A class to manage logs

[![Build Status](https://api.travis-ci.org/Psychopoulet/node-logs.svg?branch=master)](https://travis-ci.org/Psychopoulet/node-logs)
[![Coverage Status](https://coveralls.io/repos/github/Psychopoulet/node-logs/badge.svg?branch=master)](https://coveralls.io/github/Psychopoulet/node-logs)
[![Dependency Status](https://david-dm.org/Psychopoulet/node-logs/status.svg)](https://david-dm.org/Psychopoulet/node-logs)
[![Dev dependency Status](https://david-dm.org/Psychopoulet/node-logs/dev-status.svg)](https://david-dm.org/Psychopoulet/node-logs?type=dev)

## Installation

```bash
$ npm install node-logs
```

## Features

  * Easily manage your logs in the way you want
  * Show logs in the command prompt
  * Save logs in sqlite formate, order by date (different files) & time
  * Add interfaces to use new specific way to log data (api, json, etc...)
  * Delete old x days local logs automaticly
  * Read local logs

## Doc

-- Interfaces --

```typescript
interface iLogDate {
  year: string,
  month: string,
  day: string
}

interface iLog {
  date: string,
  time: string,
  type: string,
  message: string
}
```

-- Constructor --

* ``` constructor () ```

-- Methods --

* -- Accessors --
* ``` deleteLogsAfterXDays (deleteLogsAfterXDays: number): this ```
* ``` localStorageDatabase (localStorageDatabase: string): this ```
* ``` showInConsole (showInConsole: boolean): this ```

* -- Init / Release --
* ``` init(): Promise< resolve<void> | reject<Error> > ``` create local storage if not exists and delete old logs
* ``` release(): Promise< resolve<void> | reject<Error> > ```

* -- Interfaces --
* ``` addInterface(): Promise< resolve<void> | reject< ReferenceError|TypeError|Error > > // add your own way to log data ```

* -- Write logs --
* ``` log(text: any) : Promise< resolve<void> | reject<Error> > ```
* ``` success(text: any): Promise< resolve<void> | reject<Error> > ``` alias : "ok"
* ``` warning(text: any): Promise< resolve<void> | reject<Error> > ``` alias : "warn"
* ``` error(text: any): Promise< resolve<void> | reject<Error> > ``` alias : "err"
* ``` information(text: any): Promise< resolve<void> | reject<Error> > ``` alias : "info"

* -- Read logs --
* ``` getLogs(): Promise< resolve< Array<iLogDate> > | reject<Error> > ```
* ``` readLog(year: string|number, month: string|number, day: string|number): Promise< resolve< Array<iLog> > | reject< ReferenceError|TypeError|Error > > ```

## Examples

### Native

```javascript
const Logs = require("node-logs");
const logs = new Logs();
```

```javascript
// optionnal : configure the logger
logs
  .deleteLogsAfterXDays(2)
  .localStorageDatabase(require("path").join(__dirname, "logs.db"))
  .showInConsole(false);
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

  "log" : (msg) => { _myOwnLogger("log", msg); },
  "success" : (msg) => { _myOwnLogger("success", msg); },
  "info" : (msg) => { _myOwnLogger("info", msg); },
  "warning" : (msg) => { _myOwnLogger("warning", msg); },
  "error" : (msg) => { _myOwnLogger("error", msg); }

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
  logs.info("info");
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
     return logs.info("info");
  }).catch((err) => {
     console.log(err);
  });

  // read

  logs.getLogs().then((logs) => {
     return logs.readLog(year, month, day);
  }).then((logs) => {
     console.log(logs);
  }).catch((err) => {
     console.log(err);
  });

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
$ gulp
```

## License

  [ISC](LICENSE)
