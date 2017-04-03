
"use strict";

// deps

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

require("colors");
var sqlite3 = require("sqlite3");

// private

// methods

function _inputInterfaces(interfaces, i, msg, type) {

	if (i >= interfaces.length) {
		return Promise.resolve();
	} else {

		var result = null;

		switch (type) {

			case "log":
				result = interfaces[i].log(msg);
				break;
			case "success":
				result = interfaces[i].success(msg);
				break;
			case "info":
				result = interfaces[i].info(msg);
				break;
			case "warning":
				result = interfaces[i].warning(msg);
				break;
			case "error":
				result = interfaces[i].error(msg);
				break;

		}

		return new Promise(function (resolve, reject) {

			if (!result) {
				resolve();
			} else if ("boolean" === typeof result) {

				if (result) {
					resolve();
				} else {
					reject(new Error("Impossible to log \"" + msg + "\" message with \"" + type + "\" type on all the interfaces"));
				}
			} else if ("object" === (typeof result === "undefined" ? "undefined" : _typeof(result)) && result instanceof Promise) {
				result.then(resolve).catch(reject);
			} else {
				resolve();
			}
		}).then(function () {
			return _inputInterfaces(interfaces, i + 1, msg, type);
		});
	}
}

function _input(interfaces, msg, type) {

	if ("undefined" === typeof interfaces) {
		return Promise.reject(new ReferenceError("Missing \"interfaces\" data"));
	} else if ("object" !== (typeof interfaces === "undefined" ? "undefined" : _typeof(interfaces)) || !(interfaces instanceof Array)) {
		return Promise.reject(new TypeError("\"interfaces\" data is not a string"));
	} else if (0 >= interfaces.length) {
		return Promise.resolve();
	} else if ("undefined" === typeof msg) {
		return Promise.reject(new ReferenceError("Missing \"msg\" data"));
	} else if ("string" !== typeof msg && "object" !== (typeof msg === "undefined" ? "undefined" : _typeof(msg))) {
		return Promise.reject(new TypeError("\"msg\" data is not a string or an object"));
	} else if ("undefined" === typeof type) {
		return Promise.reject(new ReferenceError("Missing \"type\" data"));
	} else if ("string" !== typeof type) {
		return Promise.reject(new TypeError("\"type\" data is not a string"));
	} else if (-1 >= ["log", "success", "info", "warning", "error"].indexOf(type)) {
		return Promise.reject(new TypeError("\"type\" data is not in [ \"log\", \"success\", \"info\", \"warning\", \"error\" ] "));
	} else {
		return _inputInterfaces(interfaces, 0, "object" === (typeof msg === "undefined" ? "undefined" : _typeof(msg)) ? JSON.stringify(msg) : msg, type);
	}
}

// module

module.exports = function () {
	function NodeLogs() {
		_classCallCheck(this, NodeLogs);

		// direct output
		this._showInConsole = true;

		// delete old logs
		this._deleteLogsAfterXDays = 7;

		// local storage
		this._localStorageDatabase = "logs.db";
		this._localStorageObject = null;

		// other storages interfaces
		this._interfaces = [];
	}

	// accessors

	_createClass(NodeLogs, [{
		key: "deleteLogsAfterXDays",
		value: function deleteLogsAfterXDays(_deleteLogsAfterXDays) {

			if ("undefined" === typeof _deleteLogsAfterXDays) {
				throw new ReferenceError("Missing \"deleteLogsAfterXDays\" data");
			} else if ("number" !== typeof _deleteLogsAfterXDays) {
				throw new TypeError("\"deleteLogsAfterXDays\" data is not a number");
			} else {
				this._deleteLogsAfterXDays = _deleteLogsAfterXDays;return this;
			}
		}
	}, {
		key: "localStorageDatabase",
		value: function localStorageDatabase(_localStorageDatabase) {

			if ("undefined" === typeof _localStorageDatabase) {
				throw new ReferenceError("Missing \"localStorageDatabase\" data");
			} else if ("string" !== typeof _localStorageDatabase) {
				throw new TypeError("\"localStorageDatabase\" data is not a string");
			} else {
				this._localStorageDatabase = _localStorageDatabase;return this;
			}
		}
	}, {
		key: "showInConsole",
		value: function showInConsole(_showInConsole) {

			if ("undefined" === typeof _showInConsole) {
				throw new ReferenceError("Missing \"showInConsole\" data");
			} else if ("boolean" !== typeof _showInConsole) {
				throw new TypeError("\"showInConsole\" data is not a boolean");
			} else {
				this._showInConsole = _showInConsole;return this;
			}
		}

		// init / release

	}, {
		key: "init",
		value: function init() {
			var _this = this;

			var fs = require("fs");

			// local storage exists
			return new Promise(function (resolve, reject) {

				fs.lstat(_this._localStorageDatabase, function (err, stats) {

					if (err) {

						if (err.code && "ENOENT" === err.code) {
							resolve(false);
						} else {
							reject(err);
						}
					} else {
						resolve(stats.isFile());
					}
				});

				// if not, create
			}).then(function (isFile) {

				if (isFile) {

					return new Promise(function (resolve) {

						_this._localStorageObject = new sqlite3.Database(_this._localStorageDatabase);

						_this._localStorageObject.serialize(function () {
							resolve();
						});
					});
				} else {

					return new Promise(function (resolve, reject) {

						fs.writeFile(_this._localStorageDatabase, "", function (err) {

							if (err) {
								reject(err);
							} else {
								resolve();
							}
						});
					}).then(function () {

						return new Promise(function (resolve, reject) {

							_this._localStorageObject = new sqlite3.Database(_this._localStorageDatabase);

							_this._localStorageObject.serialize(function () {

								if (isFile) {
									resolve();
								} else {

									_this._localStorageObject.run("CREATE TABLE logs (" + " id INTEGER PRIMARY KEY AUTOINCREMENT," + " type VARCHAR(10)," + " _datetime DATETIME," + " message TEXT" + " );", function (err) {

										if (err) {
											reject(err);
										} else {
											resolve();
										}
									});
								}
							});
						});
					});
				}

				// add local storage interface
			}).then(function () {

				function _localStorage(localStorageObject, msg, type) {

					return new Promise(function (resolve, reject) {

						localStorageObject.prepare("INSERT INTO logs VALUES (NULL, ?, DATETIME(), ?);").run(type, msg).finalize(function (err) {

							if (err) {
								reject(err);
							} else {
								resolve();
							}
						});

						resolve();
					});
				}

				return _this.addInterface({

					log: function log(msg) {
						return _localStorage(_this._localStorageObject, msg, "log");
					},
					success: function success(msg) {
						return _localStorage(_this._localStorageObject, msg, "success");
					},
					info: function info(msg) {
						return _localStorage(_this._localStorageObject, msg, "info");
					},
					warning: function warning(msg) {
						return _localStorage(_this._localStorageObject, msg, "warning");
					},
					error: function error(msg) {
						return _localStorage(_this._localStorageObject, msg, "error");
					}

				});

				// delete old logs
			}).then(function () {

				return new Promise(function (resolve) {

					_this._localStorageObject.run("DELETE FROM logs WHERE _datetime <= date('now', '-" + _this._deleteLogsAfterXDays + " days');", function (err) {

						if (err) {
							reject(err);
						} else {
							resolve();
						}
					});
				});
			});
		}
	}, {
		key: "release",
		value: function release() {
			var _this2 = this;

			return new Promise(function (resolve, reject) {

				_this2._localStorageObject.close(function (err) {

					if (err) {
						reject(err);
					} else {
						resolve();
					}
				});
			}).then(function () {

				_this2._localStorageObject = null;
				return Promise.resolve();
			});
		}
	}, {
		key: "addInterface",
		value: function addInterface(logInterface) {
			var _this3 = this;

			return new Promise(function (resolve, reject) {

				// check interface
				if ("undefined" === typeof logInterface) {
					reject(new ReferenceError("Missing \"logInterface\" data"));
				} else if ("object" !== (typeof logInterface === "undefined" ? "undefined" : _typeof(logInterface))) {
					reject(new TypeError("\"logInterface\" data is not an object"));
				}

				// check interface components

				// log
				else if ("undefined" === typeof logInterface.log) {
						reject(new ReferenceError("Missing \"logInterface.log\" data"));
					} else if ("function" !== typeof logInterface.log) {
						reject(new TypeError("\"logInterface.log\" data is not a function"));
					}

					// success
					else if ("undefined" === typeof logInterface.success) {
							reject(new ReferenceError("Missing \"logInterface.success\" data"));
						} else if ("function" !== typeof logInterface.success) {
							reject(new TypeError("\"logInterface.success\" data is not a function"));
						}

						// info
						else if ("undefined" === typeof logInterface.info) {
								reject(new ReferenceError("Missing \"logInterface.info\" data"));
							} else if ("function" !== typeof logInterface.info) {
								reject(new TypeError("\"logInterface.info\" data is not a function"));
							}

							// warning
							else if ("undefined" === typeof logInterface.warning) {
									reject(new ReferenceError("Missing \"logInterface.warning\" data"));
								} else if ("function" !== typeof logInterface.warning) {
									reject(new TypeError("\"logInterface.warning\" data is not a function"));
								}

								// error
								else if ("undefined" === typeof logInterface.error) {
										reject(new ReferenceError("Missing \"logInterface.error\" data"));
									} else if ("function" !== typeof logInterface.error) {
										reject(new TypeError("\"logInterface.error\" data is not a function"));
									} else {
										_this3._interfaces.push(logInterface);resolve();
									}
			});
		}

		// get logs

	}, {
		key: "getLogs",
		value: function getLogs() {
			var _this4 = this;

			return new Promise(function (resolve, reject) {

				_this4._localStorageObject.all("SELECT " + "strftime(\"%Y\", _datetime) AS year, strftime(\"%m\", _datetime) AS month, strftime(\"%d\", _datetime) AS day " + "FROM logs " + "GROUP BY year, month, day;", function (err, rows) {

					if (err) {
						reject(err);
					} else {
						resolve(rows);
					}
				});
			});

			/*return fs.readdirProm(_pathDirLogs).then((files) =>  {
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
   		});*/
		}

		/*read (year, month, day, filenumber) {
  
  	let sText = "<tr class=\"line\">";
  				sText += "<th class=\"time\">" + _formatedTime() + "</th>";
  		
  		sText += "<td class=\"message " + type + "\">";
  			sText += ("object" === typeof msg) ? JSON.stringify(msg) : msg;
  		sText += "</td>";
  		
  	sText += "</tr>";
  
  
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
  */

		/*// delete log
  
  	remove (year, month, day, filenumber) {
  
  		return fs.unlinkProm(
  			path.join(_pathDirLogs, year + "_" + month + "_" + day + "_" + filenumber + ".html")
  		);
  
  	}
  
  
  	function _delete(that, filenumber, year, month, day, logs) {
  
  		return that.remove(year, month, day, logs[year][month][day][filenumber]).then(() =>  {
  
  			if (filenumber + 1 < logs[year][month][day].length) {
  				return _delete(that, filenumber + 1, year, month, day, logs);
  			}
  			else {
  				return Promise.resolve();
  			}
  			
  		});
  
  	}
  
  	removeDay (year, month, day) {
  
  		return this.getLogs().then((logs) =>  {
  			return _delete(this, 0, year, month, day, logs);
  		});
  
  	}*/

		// log

	}, {
		key: "log",
		value: function log(msg) {

			if (this._showInConsole) {
				(1, console).log(msg);
			}

			return _input(this._interfaces, msg, "log");
		}
	}, {
		key: "ok",
		value: function ok(msg) {

			if (this._showInConsole) {
				(1, console).log(msg.green);
			}

			return _input(this._interfaces, msg, "success");
		}
	}, {
		key: "success",
		value: function success(msg) {
			return this.ok(msg);
		}
	}, {
		key: "warn",
		value: function warn(msg) {

			if (this._showInConsole) {
				(1, console).log(msg.yellow);
			}

			return _input(this._interfaces, msg, "warning");
		}
	}, {
		key: "warning",
		value: function warning(msg) {
			return this.warn(msg);
		}
	}, {
		key: "err",
		value: function err(msg) {

			if (this._showInConsole) {
				(1, console).error(msg.red);
			}

			return _input(this._interfaces, msg, "error");
		}
	}, {
		key: "error",
		value: function error(msg) {
			return this.err(msg);
		}
	}, {
		key: "info",
		value: function info(msg) {

			if (this._showInConsole) {
				(1, console).log(msg.cyan);
			}

			return _input(this._interfaces, msg, "info");
		}
	}]);

	return NodeLogs;
}();