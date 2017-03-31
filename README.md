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
  * Delete logs

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

  * ``` deleteLogsAfterXDays (integer deleteLogsAfterXDays) : this ```
  * ``` localStorageDatabase (string localStorageDatabase) : this ```
  * ``` showInConsole (boolean showInConsole) : this ```

  * ``` init () : Promise ``` create local storage if not exists and delete old logs
  * ``` release () : Promise ```

  * ``` addInterface () : Promise // add your own way to log data ```

  * ``` log (string text) : Promise ```
  * ``` success (string text) : Promise ``` alias : "ok"
  * ``` warning (string text) : Promise ``` alias : "warn"
  * ``` error (string text) : Promise ```   alias : "err"
  * ``` info (string text) : Promise ```

  * ``` getLogs () : Promise ``` then((logs) => {}) => { '<year>': { '<month1>': [ '<day1>', '<day2>', ... ], ... }, ... }
  * ``` read (string year (f=yyyy)>, string month (f=mm)>, string day (f=dd)>, string|int filenumber) : Promise ``` then((HTMLLogs) => {})
  * ``` lastWritableFile () : Promise ``` then((filepath) => {})
  * ``` remove (string year (f=yyyy)>, string month (f=mm)>, string day (f=dd)>, string|int filenumber) : Promise ```
  * ``` removeDay (string year (f=yyyy)>, string month (f=mm)>, string day (f=dd)>) : Promise ``` remove all this day's logs

## Examples

```js
var logs = new (require('node-logs'))();

logs
  .deleteLogsAfterXDays(2)
  .localStorageDatabase(require('path').join(__dirname, 'logs.db'))
  .showInConsole(false);

logs.init(() => {

  // write

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
     return logs.read(year, month, day, 1);
  }).then((content) => {
     return logs.removeDay(year, month, day);
  }).then(() => {
     console.log('removed');
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
