# simplelogs
A basic class to manage logs


## Installation

```bash
$ npm install simplelogs
```

## Features

  * Show logs in the command prompt
  * Save logs in html formate, order by date (different files) & time

## Examples

```js

const SimpleLogs = require('simplelogs');
var Logs = new SimpleLogs('/var/simplelogs/logs'); // constructor (pathDirLogs, showInConsole, showInFiles)

Logs.log('log').then(function() {

   // success == ok
   return Logs.ok('ok').then(function() {
      return Logs.success('success');
   });

}).then(function() {

   // warning == warn
   return Logs.warn('warn').then(function() {
      return Logs.warning('warning');
   });

}).then(function() {

   // error == err
   return Logs.err('err').then(function() {
      return Logs.error('error');
   });

}).then(function() {
   return Logs.info('info');
}).catch(function(err) {
   console.log(err);
});

Logs.pathDirLogs = require('path').join(__dirname, 'logs');  // where the log files are stored
Logs.showInConsole = false; // disable logs in command prompt (prod ?)
Logs.showInFiles = false; // disable logs in files (debug ?)

Logs.getLogs().then(function(logs) {

   console.log(logs); // formate:  { '<year>': { '<month1>': [ '<day1>', '<day2>', ... ], ... }, ... }

   return Logs.read('<year (f=yyyy)>', '<month (f=mm)>', '<day (f=dd)>');

}).then(function(content) {

   console.log(content);

   return Logs.remove('<year (f=yyyy)>', '<month (f=mm)>', '<day (f=dd)>');

}).then(function() {

   console.log('removed');

}).catch(function(err) {
   console.log(err);
});

```

## Tests

```bash
$ gulp
```

## License

  [ISC](LICENSE)
