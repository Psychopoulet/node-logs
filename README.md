# node-logs
A class to manage basic logs


## Installation

```bash
$ npm install node-logs
```

## Features

  * Show logs in the command prompt
  * Save logs in html formate, order by date (different files) & time
  * Split files to avoid too-sized logs
  * Read file in html formate
  * Delete file

## Doc

  * ``` string pathDirLogs ```    // where the log files are stored
  * ``` boolean showInConsole ``` // disable logs in command prompt (prod ?)
  * ``` boolean showInFiles ```   // disable logs in files (debug ?)

  * ``` constructor ([ string pathDirLogs, [ boolean showInConsole, [ boolean showInFiles ] ] ]) ```

  * ``` getLogs () : Promise ``` then((logs) => {}) => { '<year>': { '<month1>': [ '<day1>', '<day2>', ... ], ... }, ... }
  * ``` read (string year (f=yyyy)>, string month (f=mm)>, string day (f=dd)>, string|int filenumber) : Promise ``` then((HTMLLogs) => {})
  * ``` lastWritableFile () : Promise ``` then((filepath) => {})
  * ``` remove (string year (f=yyyy)>, string month (f=mm)>, string day (f=dd)>, string|int filenumber) : Promise ```
  * ``` removeDay (string year (f=yyyy)>, string month (f=mm)>, string day (f=dd)>) : Promise ``` remove all this day's logs

  * ``` logInFile (string text, string type) : Promise ``` create your own logs
  * ``` log (string text) : Promise ```
  * ``` success (string text) : Promise ``` alias : "ok"
  * ``` warning (string text) : Promise ``` alias : "warn"
  * ``` error (string text) : Promise ```   alias : "err"
  * ``` info (string text) : Promise ```

## Examples

```js
var Logs = new (require('node-logs'))('/var/node-logs/logs');

Logs.log('log');
Logs.ok('ok');
Logs.warn('warn');
Logs.err('err');
Logs.info('info');

Logs.log('log').then(() => {

   return Logs.ok('ok').then(() => {
      return Logs.success('success');
   });

}).then(() => {

   return Logs.warn('warn').then(() => {
      return Logs.warning('warning');
   });

}).then(() => {

   return Logs.err('err').then(() => {
      return Logs.error('error');
   });

}).then(() => {
   return Logs.info('info');
}).catch((err) => {
   console.log(err);
});

Logs.pathDirLogs = require('path').join(__dirname, 'logs');
Logs.showInConsole = true;
Logs.showInFiles = false;

Logs.getLogs().then((logs) => {
   return Logs.read(year, month, day, 1);
}).then((content) => {
   return Logs.removeDay(year, month, day);
}).then(() => {
   console.log('removed');
}).catch((err) => {
   console.log(err);
});
```

## Tests

```bash
$ gulp
```

## License

  [ISC](LICENSE)
