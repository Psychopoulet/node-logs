
"use strict";

// deps

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

require("colors");

var path = require("path"),
    fs = require("node-promfs");

// consts

var MAX_FILE_SIZE = 1024 * 1000;

// private

// attrs

var _pathDirLogs;

// methods

function _formatedDate() {

	var sResult = "",
	    date = new Date(),
	    nMonth = date.getMonth() + 1,
	    nDay = date.getDate();

	sResult += date.getFullYear();
	sResult += "_";
	sResult += 9 < nMonth ? nMonth : "0" + nMonth;
	sResult += "_";
	sResult += 9 < nDay ? nDay : "0" + nDay;

	return sResult;
}

function _formatedTime() {

	var sResult = "",
	    date = new Date(),
	    nHours = date.getHours(),
	    nMinutes = date.getMinutes();

	sResult += 9 < nHours ? nHours : "0" + nHours;
	sResult += ":";
	sResult += 9 < nMinutes ? nMinutes : "0" + nMinutes;

	return sResult;
}

function _fileIsFull(filepath) {

	return fs.isFileProm(filepath).then(function (exists) {

		if (!exists) {
			return Promise.resolve(false);
		} else {

			return fs.statProm(filepath).then(function (stats) {

				if (MAX_FILE_SIZE > stats.size) {
					return Promise.resolve(false);
				} else {
					return Promise.resolve(true);
				}
			});
		}
	});
}

function _delete(that, filenumber, year, month, day, logs) {

	return that.remove(year, month, day, logs[year][month][day][filenumber]).then(function () {

		if (filenumber + 1 < logs[year][month][day].length) {
			return _delete(that, filenumber + 1, year, month, day, logs);
		} else {
			return Promise.resolve();
		}
	});
}

// module

module.exports = function () {
	function NodeLogs(pathDirLogs, showInConsole, showInFiles) {
		_classCallCheck(this, NodeLogs);

		this.pathDirLogs = pathDirLogs ? pathDirLogs : path.join(__dirname, "logs");

		this.showInConsole = showInConsole ? showInConsole : true;
		this.showInFiles = showInFiles ? showInFiles : true;
	}

	// accessors

	_createClass(NodeLogs, [{
		key: "getLogs",


		// get logs

		value: function getLogs() {

			return fs.readdirProm(_pathDirLogs).then(function (files) {

				var result = {};

				files.forEach(function (file) {

					file = file.replace(".html", "").split("_");

					if (!result[file[0]]) {
						result[file[0]] = {};
					}
					if (!result[file[0]][file[1]]) {
						result[file[0]][file[1]] = {};
					}
					if (!result[file[0]][file[1]][file[2]]) {
						result[file[0]][file[1]][file[2]] = [];
					}

					result[file[0]][file[1]][file[2]].push(file[3]);
				});

				return Promise.resolve(result);
			});
		}
	}, {
		key: "read",
		value: function read(year, month, day, filenumber) {

			var file = path.join(_pathDirLogs, year + "_" + month + "_" + day + "_" + filenumber + ".html");

			return fs.isFileProm(file).then(function (exists) {

				if (!exists) {
					return Promise.resolve("<table class=\"node-logs\"><tbody class=\"list\"></tbody></table>");
				} else {

					return fs.readFileProm(file, "utf8").then(function (content) {
						return Promise.resolve("<table class=\"node-logs\"><tbody class=\"list\">" + content + "</tbody></table>");
					}).catch(function (err) {
						return Promise.reject(err.message ? err.message : err);
					});
				}
			});
		}
	}, {
		key: "lastWritableFile",
		value: function lastWritableFile(lastfilenumber) {
			var _this = this;

			if ("number" !== typeof lastfilenumber || 0 > lastfilenumber) {
				lastfilenumber = 0;
			}

			var filepath = path.join(_pathDirLogs, _formatedDate() + "_" + lastfilenumber + ".html");

			return _fileIsFull(filepath).then(function (isfulll) {

				if (!isfulll) {
					return Promise.resolve(filepath);
				} else {
					return _this.lastWritableFile(lastfilenumber + 1);
				}
			});
		}

		// delete log

	}, {
		key: "remove",
		value: function remove(year, month, day, filenumber) {

			return fs.unlinkProm(path.join(_pathDirLogs, year + "_" + month + "_" + day + "_" + filenumber + ".html"));
		}
	}, {
		key: "removeDay",
		value: function removeDay(year, month, day) {
			var _this2 = this;

			return this.getLogs().then(function (logs) {
				return _delete(_this2, 0, year, month, day, logs);
			});
		}

		// formate log

	}, {
		key: "logInFile",
		value: function logInFile(msg, type) {
			var _this3 = this;

			// formate log text

			var sText = "<tr class=\"line\">";

			sText += "<th class=\"time\">" + _formatedTime() + "</th>";

			sText += "<td class=\"message " + type + "\">";
			sText += "object" === (typeof msg === "undefined" ? "undefined" : _typeof(msg)) ? JSON.stringify(msg) : msg;
			sText += "</td>";

			sText += "</tr>";

			// write in log file

			return fs.isDirectoryProm(_pathDirLogs).then(function (exists) {

				if (exists) {
					return Promise.resolve();
				} else {
					return fs.mkdirpProm(_pathDirLogs);
				}
			}).then(function () {
				return _this3.lastWritableFile();
			}).then(function (filepath) {
				return fs.appendFileProm(filepath, sText, "utf8");
			});
		}

		// log

	}, {
		key: "log",
		value: function log(msg) {

			if (this.showInConsole) {
				(1, console).log(msg);
			}

			if (this.showInFiles) {
				return this.logInFile(msg, "log");
			} else {
				return Promise.resolve();
			}
		}
	}, {
		key: "ok",
		value: function ok(msg) {

			if (this.showInConsole) {
				(1, console).log(msg.green);
			}

			if (this.showInFiles) {
				return this.logInFile(msg, "success");
			} else {
				return Promise.resolve();
			}
		}
	}, {
		key: "success",
		value: function success(msg) {
			return this.ok(msg);
		}
	}, {
		key: "warn",
		value: function warn(msg) {

			if (this.showInConsole) {
				(1, console).log(msg.yellow);
			}

			if (this.showInFiles) {
				return this.logInFile(msg, "warning");
			} else {
				return Promise.resolve();
			}
		}
	}, {
		key: "warning",
		value: function warning(msg) {
			return this.warn(msg);
		}
	}, {
		key: "err",
		value: function err(msg) {

			if (this.showInConsole) {
				(1, console).log(msg.red);
			}

			if (this.showInFiles) {
				return this.logInFile(msg, "error");
			} else {
				return Promise.resolve();
			}
		}
	}, {
		key: "error",
		value: function error(msg) {
			return this.err(msg);
		}
	}, {
		key: "info",
		value: function info(msg) {

			if (this.showInConsole) {
				(1, console).log(msg.cyan);
			}

			if (this.showInFiles) {
				return this.logInFile(msg, "info");
			} else {
				return Promise.resolve();
			}
		}
	}, {
		key: "pathDirLogs",
		get: function get() {
			return _pathDirLogs;
		},
		set: function set(dir) {

			if ("string" !== typeof dir) {
				throw new Error(this.constructor.name + "/pathDirLogs : this is not a valid directory");
			} else {
				_pathDirLogs = path.normalize(dir);
			}
		}
	}]);

	return NodeLogs;
}();