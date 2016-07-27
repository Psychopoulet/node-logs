
"use strict";

// deps

	require("colors");

	const path = require("path"), fs = require("node-promfs");

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

// module

module.exports = class SimpleLogs {

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
				fs.mkdirpSync(_pathDirLogs);
			}

		}

	// get logs

		getLogs () {

			let result = {};

			return new Promise(function(resolve, reject) {

				try {

					fs.readdirProm(_pathDirLogs).then(function(files) {

						files.forEach(function(file) {

							file = file.replace(".html", "").split("_");

							if (!result[file[0]]) {
								result[file[0]] = {};
							}
							if (!result[file[0]][file[1]]) {
								result[file[0]][file[1]] = [];
							}

							result[file[0]][file[1]].push(file[2]);

						});

						resolve(result);

					}).catch(function(err) {
						reject((err.message) ? err.message : err);
					});

				}
				catch (e) {
					reject((e.message) ? e.message : e);
				}

			});

		}

		read (year, month, day) {

			return new Promise(function(resolve, reject) {

				try {

					let file = path.join(_pathDirLogs, year + "_" + month + "_" + day + ".html");

					fs.isFileProm(file).then(function(exists) {

						if (!exists) {
							resolve("<table class=\"SimpleLogsList\"><tbody></tbody></table>");
						}
						else {

							fs.readFileProm(file, "utf8").then(function(content) {
								resolve("<table class=\"SimpleLogsList\"><tbody>" + content + "</tbody></table>");
							}).catch(function(err) {
								reject((err.message) ? err.message : err);
							});
						
						}

					}).catch(reject);

				}
				catch (e) {
					reject((e.message) ? e.message : e);
				}

			});

		}

	// delete log

		remove (year, month, day) {
			return fs.unlinkProm(path.join(_pathDirLogs, year + "_" + month + "_" + day + ".html"));
		}

	// formate log

		logInFile(msg, type) {

			let sText = "<tr class=\"SimpleLogsLine\">";

				sText += "<th class=\"SimpleLogsTime\">" + _formatedTime() + "</th>";
				
				sText += "<td class=\"SimpleLogsMessage " + type + "\">";
					sText += ("object" === typeof msg) ? JSON.stringify(msg) : msg;
				sText += "</td>";
				
			sText += "</tr>";

			return fs.appendFileProm(path.join(_pathDirLogs, _formatedDate() + ".html"), sText, "utf8");

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
