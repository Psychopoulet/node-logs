# node-logs
A class to manage logs


## Installation

```bash
$ npm install node-logs
```

## Features

  * Show logs in the command prompt
  * Save logs in sqlite formate, order by date (different files) & time
  * Add interfaces to use new specific way to log data (api, json, etc...)
  * Delete old x days logs
  * Read logs

## Doc

  -- Attributes --

  * ``` integer _deleteLogsAfterXDays ``` limit old logs
  * ``` string _localStorageDatabase ``` where the local logs are stored (path)
  * ``` sqlite3 _localStorageObject ``` where the local logs are stored (sqlite3 object)
  * ``` boolean _showInConsole ``` disable logs in command prompt (prod ?)
  * ``` Array _interfaces ``` disable logs in files (debug ?)

  -- Constructor --

  * ``` constructor () ```

  -- Methods --

  * -- Accessors --
  * ``` deleteLogsAfterXDays (integer deleteLogsAfterXDays) : this ```
  * ``` localStorageDatabase (string localStorageDatabase) : this ```
  * ``` showInConsole (boolean showInConsole) : this ```

  * -- Init / Release --
  * ``` init () : Promise ``` create local storage if not exists and delete old logs
  * ``` release () : Promise ```

  * -- Interfaces --
  * ``` addInterface () : Promise // add your own way to log data ```

  * -- Write logs --
  * ``` log (string text) : Promise ```
  * ``` success (string text) : Promise ``` alias : "ok"
  * ``` warning (string text) : Promise ``` alias : "warn"
  * ``` error (string text) : Promise ```   alias : "err"
  * ``` info (string text) : Promise ```

  * -- Read logs --
  * ``` getLogs() : Promise ``` then((Array logs) => { logs.forEach((log) => { console.log(log.year, log.month, log.day); }); })
  * ``` readLog (string year (f=yyyy), string month (f=mm), string day (f=dd)) : Promise ``` then((logs) => { logs.forEach((log) => { console.log(log.date, log.time, log.type, log.message); }); })

## Examples

```js
const Logs = new (require('node-logs'))();
const logs = new Logs();
```

```js
// optionnal : configure the logger
logs
  .deleteLogsAfterXDays(2)
  .localStorageDatabase(require('path').join(__dirname, 'logs.db'))
  .showInConsole(false);
```

```js
// example: link the logger to a Web API
const http = require('http');

function _myOwnLogger(type, msg) {

  http.request({
    host: 'www.myownloger.com',
    method: 'PUT',
    path: '/api/' + type + '/',
    data: {
      message: msg
    }
  }, (err) => {
    if (err) { console.log(err); }
  }).end();

}

logs.addInterface({

  log : (msg) => { _myOwnLogger('log', msg); },
  success : (msg) => { _myOwnLogger('success', msg); },
  info : (msg) => { _myOwnLogger('info', msg); },
  warning : (msg) => { _myOwnLogger('warning', msg); },
  error : (msg) => { _myOwnLogger('error', msg); }

}).then(() => {
  console.log("MyOwnLoger added !");
}).catch((err) => {
  console.error(err);
});
```

```js
return logs.init().then(() => {

  // you can use the logger in a classical way

  logs.log('log');
  logs.success('success'); logs.ok('ok');
  logs.info('info');
  logs.warning('warning'); logs.warn('warn');
  logs.error('error'); logs.err('err');

  // or with promises if you added an asynchronous interface

  logs.log('log').then(() => {

     return logs.ok('ok').then(() => {
        return logs.success('success');
     });

  }).then(() => {

     return logs.warn('warn').then(() => {
        return logs.warning('warning');
     });

  }).then(() => {

     return logs.err('err').then(() => {
        return logs.error('error');
     });

  }).then(() => {
     return logs.info('info');
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

## Tests

```bash
$ gulp
```

## License

  [ISC](LICENSE)
