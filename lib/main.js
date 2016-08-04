
"use strict";

// deps

	require("colors");

	const path = require("path"), fs = require("node-promfs"), MAX_FILE_SIZE = 1024 * 1000;

// private

	// attrs

		var _pathDirLogs;

	// methods

		function _formatedDate() {

			let sResult = "",
				date = new Date(),
				nMonth = date.getMonth() + 1, nDay = date.getDate();

				sResult += date.getFullYear();
				sResult += "_";
				sResult += (9 < nMonth) ? nMonth : "0" + nMonth;
				sResult += "_";
				sResult += (9 < nDay) ? nDay : "0" + nDay;

			return sResult;

		}

		function _formatedTime() {

			let sResult = "",
				date = new Date(),
				nHours = date.getHours(), nMinutes = date.getMinutes();

				sResult += (9 < nHours) ? nHours : "0" + nHours;
				sResult += ":";
				sResult += (9 < nMinutes) ? nMinutes : "0" + nMinutes;

			return sResult;

		}

		function _fileIsFull(filepath) {

			return fs.isFileProm(filepath).then((exists) => {

				if (!exists) {
					return Promise.resolve(false);
				}
				else {

					return fs.statProm(filepath).then((stats) => {

						if (MAX_FILE_SIZE > stats.size) {
							return Promise.resolve(false);
						}
						else {
							return Promise.resolve(true);
						}

					});

				}

			});

		}

// module

module.exports = class NodeLogs {

	constructor (pathDirLogs, showInConsole, showInFiles) {

		this.pathDirLogs = (pathDirLogs) ? pathDirLogs : path.join(__dirname, "logs");

		this.showInConsole = (showInConsole) ? showInConsole : true;
		this.showInFiles = (showInFiles) ? showInFiles : true;
		
	}

	// accessors

		get pathDirLogs () {
			return _pathDirLogs;
		}

		set pathDirLogs (dir) {

			if ("string" !== typeof dir) {
				throw new Error(this.constructor.name + "/pathDirLogs : this is not a valid directory");
			}
			else {
				_pathDirLogs = path.normalize(dir);
			}

		}

	// get logs

		getLogs () {

			return fs.readdirProm(_pathDirLogs).then((files) =>  {

				let result = {};

				files.forEach((file) =>  {

					file = file.replace(".html", "").split("_");

					if (!result[file[0]]) {
						result[file[0]] = {};
					}
					if ( !result [file[0]] [file[1]] ) {
						result [file[0]] [file[1]] = {};
					}
					if ( !result [file[0]] [file[1]] [file[2]] ) {
						result [file[0]] [file[1]] [file[2]] = [];
					}

					result [file[0]] [file[1]] [file[2]] .push(file[3]);

				});

				return Promise.resolve(result);

			}).catch((err) =>  {
				return Promise.reject((err.message) ? err.message : err);
			});

		}

		read (year, month, day, filenumber) {

			let file = path.join(_pathDirLogs, year + "_" + month + "_" + day + "_" + filenumber + ".html");

			return fs.isFileProm(file).then((exists) =>  {

				if (!exists) {
					return Promise.resolve("<table class=\"node-logs\"><tbody class=\"list\"></tbody></table>");
				}
				else {

					return fs.readFileProm(file, "utf8").then((content) =>  {
						return Promise.resolve("<table class=\"node-logs\"><tbody class=\"list\">" + content + "</tbody></table>");
					}).catch((err) =>  {
						return Promise.reject((err.message) ? err.message : err);
					});
				
				}

			});

		}

		lastWritableFile(lastfilenumber) {

			if ("number" !== typeof lastfilenumber || 0 > lastfilenumber) {
				lastfilenumber = 0;
			}

			let filepath = path.join(_pathDirLogs, _formatedDate() + "_" + lastfilenumber + ".html");

			return _fileIsFull(filepath).then((isfulll) => {

				if (!isfulll) {
					return Promise.resolve(filepath);
				}
				else {
					return this.lastWritableFile(lastfilenumber + 1);
				}

			});


		}

	// delete log

		remove (year, month, day, filenumber) {
			return fs.unlinkProm(path.join(_pathDirLogs, year + "_" + month + "_" + day + "_" + filenumber + ".html"));
		}

		removeDay (year, month, day) {

			return this.getLogs().then((logs) =>  {

				function _delete(that, filenumber) {

					return that.remove(year, month, day, logs[year][month][day][filenumber]).then(() =>  {

						if (filenumber + 1 < logs[year][month][day].length) {
							return _delete(that, filenumber + 1);
						}
						else {
							return Promise.resolve();
						}
						
					});

				}

				return _delete(this, 0);

			});

		}

	// formate log

		logInFile(msg, type) {

			// formate log text

			let sText = "<tr class=\"line\">";

				sText += "<th class=\"time\">" + _formatedTime() + "</th>";
				
				sText += "<td class=\"message " + type + "\">";
					sText += ("object" === typeof msg) ? JSON.stringify(msg) : msg;
				sText += "</td>";
				
			sText += "</tr>";

			// write in log file

			return fs.isDirectoryProm(_pathDirLogs).then((exists) => {

				if (exists) {
					return Promise.resolve();
				}
				else {
					return fs.mkdirpProm(_pathDirLogs);
				}

			}).then(() => {
				return this.lastWritableFile();
			}).then((filepath) => {
				return fs.appendFileProm(filepath, sText, "utf8");
			});

		}
	
	// log

		log (msg) {

			if (this.showInConsole) {
				(1, console).log(msg);
			}

			if (this.showInFiles) {
				return this.logInFile(msg, "log");
			}
			else {
				return Promise.resolve();
			}

		}
		
		ok (msg) {

			if (this.showInConsole) {
				(1, console).log(msg.green);
			}

			if (this.showInFiles) {
				return this.logInFile(msg, "success");
			}
			else {
				return Promise.resolve();
			}

		}
		
			success (msg) {
				return this.ok(msg);
			}
			
		warn (msg) {

			if (this.showInConsole) {
				(1, console).log(msg.yellow);
			}

			if (this.showInFiles) {
				return this.logInFile(msg, "warning");
			}
			else {
				return Promise.resolve();
			}

		}
			
			warning (msg) {
				return this.warn(msg);
			}
			
		err (msg) {

			if (this.showInConsole) {
				(1, console).log(msg.red);
			}

			if (this.showInFiles) {
				return this.logInFile(msg, "error");
			}
			else {
				return Promise.resolve();
			}

		}
			
			error (msg) {
				return this.err(msg);
			}
			
		info (msg) {

			if (this.showInConsole) {
				(1, console).log(msg.cyan);
			}

			if (this.showInFiles) {
				return this.logInFile(msg, "info");
			}
			else {
				return Promise.resolve();
			}

		}
		
};
