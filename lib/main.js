
"use strict";

// deps

	require("colors");
	const sqlite3 = require("sqlite3");

// private

	// methods

		function _formatedTime(date) {

			let result = "",
				hours = date.getHours(), minutes = date.getMinutes();

				result += (9 < hours) ? hours : "0" + hours;
				result += ":";
				result += (9 < minutes) ? minutes : "0" + minutes;

			return result;

		}

		function _formatedDate(date) {

			let result = "",
				month = date.getMonth() + 1, day = date.getDate();

				result += date.getFullYear();
				result += "-";
				result += (9 < month) ? month : "0" + month;
				result += "-";
				result += (9 < day) ? day : "0" + day;

			return result;

		}

		function _inputInterfaces(interfaces, i, msg, type) {

			if (i >= interfaces.length) {
				return Promise.resolve();
			}
			else {

				let result = null;

				switch(type) {

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

				return new Promise((resolve, reject) => {

					if (!result) {
						resolve();
					}
					else if ("boolean" === typeof result) {

						if (result) {
							resolve();
						}
						else {
							reject(new Error("Impossible to log \"" + msg + "\" message with \"" + type + "\" type on all the interfaces"));
						}

					}
					else if ("object" === typeof result && result instanceof Promise) {
						result.then(resolve).catch(reject);
					}
					else {
						resolve();
					}

				}).then(() => {
					return _inputInterfaces(interfaces, i + 1, msg, type);
				});

			}

		}

		function _input(interfaces, msg, type) {

			if ("undefined" === typeof interfaces) {
				return Promise.reject(new ReferenceError("Missing \"interfaces\" data"));
			}
				else if ("object" !== typeof interfaces || !(interfaces instanceof Array)) {
					return Promise.reject(new TypeError("\"interfaces\" data is not a string"));
				}
				else if (0 >= interfaces.length) {
					return Promise.resolve();
				}
			else if ("undefined" === typeof msg) {
				return Promise.reject(new ReferenceError("Missing \"msg\" data"));
			}
				else if ("string" !== typeof msg && "object" !== typeof msg) {
					return Promise.reject(new TypeError("\"msg\" data is not a string or an object"));
				}
			else if ("undefined" === typeof type) {
				return Promise.reject(new ReferenceError("Missing \"type\" data"));
			}
				else if ("string" !== typeof type) {
					return Promise.reject(new TypeError("\"type\" data is not a string"));
				}
				else if (-1 >= [ "log", "success", "info", "warning", "error" ].indexOf(type)) {
					return Promise.reject(new TypeError("\"type\" data is not in [ \"log\", \"success\", \"info\", \"warning\", \"error\" ] "));
				}
			else {
				return _inputInterfaces(interfaces, 0, ("object" === typeof msg) ? JSON.stringify(msg) : msg, type);
			}

		}

// module

module.exports = class NodeLogs {

	constructor() {

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

		deleteLogsAfterXDays(deleteLogsAfterXDays) {

			if ("undefined" === typeof deleteLogsAfterXDays) {
				throw new ReferenceError("Missing \"deleteLogsAfterXDays\" data");
			}
				else if ("number" !== typeof deleteLogsAfterXDays) {
					throw new TypeError("\"deleteLogsAfterXDays\" data is not a number");
				}
			else {
				this._deleteLogsAfterXDays = deleteLogsAfterXDays; return this;
			}

		}

		localStorageDatabase(localStorageDatabase) {

			if ("undefined" === typeof localStorageDatabase) {
				throw new ReferenceError("Missing \"localStorageDatabase\" data");
			}
				else if ("string" !== typeof localStorageDatabase) {
					throw new TypeError("\"localStorageDatabase\" data is not a string");
				}
			else {
				this._localStorageDatabase = localStorageDatabase; return this;
			}

		}

		showInConsole(showInConsole) {

			if ("undefined" === typeof showInConsole) {
				throw new ReferenceError("Missing \"showInConsole\" data");
			}
				else if ("boolean" !== typeof showInConsole) {
					throw new TypeError("\"showInConsole\" data is not a boolean");
				}
			else {
				this._showInConsole = showInConsole; return this;
			}

		}

	// init / release

		init() {

			const fs = require("fs");

			// local storage exists
			return new Promise((resolve, reject) => {

				fs.lstat(this._localStorageDatabase, (err, stats) => {

					if (err) {

						if (err.code && "ENOENT" === err.code) {
							resolve(false);
						}
						else {
							reject(err);
						}
						
					}
					else {
						resolve(stats.isFile());
					}

				});

			// if not, create
			}).then((isFile) => {

				if (isFile) {
					
					return new Promise((resolve) => {

						this._localStorageObject = new sqlite3.Database(this._localStorageDatabase);

						this._localStorageObject.serialize(() => {
							resolve();
						});

					});

				}
				else {

					return new Promise((resolve, reject) => {

						fs.writeFile(this._localStorageDatabase, "", (err) => {

							if (err) {
								reject(err);
							}
							else {
								resolve();
							}

						});

					}).then(() => {

						return new Promise((resolve, reject) => {

							this._localStorageObject = new sqlite3.Database(this._localStorageDatabase);

							this._localStorageObject.serialize(() => {

								if (isFile) {
									resolve();
								}
								else {

									this._localStorageObject.run(

										"CREATE TABLE logs (" +
											" id INTEGER PRIMARY KEY AUTOINCREMENT," +
											" type VARCHAR(10)," +
											" _datetime DATETIME," +
											" message TEXT" +
										" );"
										
									, (err) => {

										if (err) {
											reject(err);
										}
										else {
											resolve();
										}

									});

								}

							});

						});

					});
					
				}

			// add local storage interface
			}).then(() => {

				function _localStorage(localStorageObject, msg, type) {

					return new Promise((resolve, reject) => {

						localStorageObject
							.prepare("INSERT INTO logs VALUES (NULL, ?, DATETIME(), ?);")
							.run(type, msg)
							.finalize((err) => {

								if (err) {
									reject(err);
								}
								else {
									resolve();
								}

							});

						resolve();

					});

				}

				return this.addInterface({

					log: (msg) => {
						return _localStorage(this._localStorageObject, msg, "log");
					},
					success: (msg) => {
						return _localStorage(this._localStorageObject, msg, "success");
					},
					info: (msg) => {
						return _localStorage(this._localStorageObject, msg, "info");
					},
					warning: (msg) => {
						return _localStorage(this._localStorageObject, msg, "warning");
					},
					error: (msg) => {
						return _localStorage(this._localStorageObject, msg, "error");
					}

				});

			// delete old logs
			}).then(() => {

				return new Promise((resolve, reject) => {

					this._localStorageObject.run("DELETE FROM logs WHERE _datetime <= date('now', '-" + this._deleteLogsAfterXDays + " days');", (err) => {

						if (err) {
							reject(err);
						}
						else {
							resolve();
						}

					});
					
				});

			});

		}

		release() {

			return new Promise((resolve, reject) => {

				this._localStorageObject.close((err) => {

					if (err) {
						reject(err);
					}
					else {
						resolve();
					}

				});

			}).then(() => {

				this._localStorageObject = null;
				return Promise.resolve();

			});

		}

	addInterface(logInterface) {

		return new Promise((resolve, reject) => {

			// check interface
			if ("undefined" === typeof logInterface) {
				reject(new ReferenceError("Missing \"logInterface\" data"));
			}
				else if ("object" !== typeof logInterface) {
					reject(new TypeError("\"logInterface\" data is not an object"));
				}

			// check interface components

				// log
				else if ("undefined" === typeof logInterface.log) {
					reject(new ReferenceError("Missing \"logInterface.log\" data"));
				}
					else if ("function" !== typeof logInterface.log) {
						reject(new TypeError("\"logInterface.log\" data is not a function"));
					}

				// success
				else if ("undefined" === typeof logInterface.success) {
					reject(new ReferenceError("Missing \"logInterface.success\" data"));
				}
					else if ("function" !== typeof logInterface.success) {
						reject(new TypeError("\"logInterface.success\" data is not a function"));
					}

				// info
				else if ("undefined" === typeof logInterface.info) {
					reject(new ReferenceError("Missing \"logInterface.info\" data"));
				}
					else if ("function" !== typeof logInterface.info) {
						reject(new TypeError("\"logInterface.info\" data is not a function"));
					}

				// warning
				else if ("undefined" === typeof logInterface.warning) {
					reject(new ReferenceError("Missing \"logInterface.warning\" data"));
				}
					else if ("function" !== typeof logInterface.warning) {
						reject(new TypeError("\"logInterface.warning\" data is not a function"));
					}

				// error
				else if ("undefined" === typeof logInterface.error) {
					reject(new ReferenceError("Missing \"logInterface.error\" data"));
				}
					else if ("function" !== typeof logInterface.error) {
						reject(new TypeError("\"logInterface.error\" data is not a function"));
					}

			else {
				this._interfaces.push(logInterface); resolve();
			}

		});

	}

	// get logs

		getLogs() {

			return new Promise((resolve, reject) => {

				this._localStorageObject.all(
					"SELECT " +
						"strftime(\"%Y\", _datetime) AS year, strftime(\"%m\", _datetime) AS month, strftime(\"%d\", _datetime) AS day " +
					"FROM logs " +
					"GROUP BY year, month, day;",
					(err, rows) => {

					if (err) {
						reject(err);
					}
					else {
						resolve(rows);
					}

				});
				
			});

		}

		readLog(year, month, day) {

			return new Promise((resolve, reject) => {

				if ("undefined" === typeof year) {
					reject(new ReferenceError("Missing \"year\" data"));
				}
					else if ("string" !== typeof year) {
						reject(new TypeError("\"year\" data is not a string"));
					}
				else if ("undefined" === typeof month) {
					reject(new ReferenceError("Missing \"month\" data"));
				}
					else if ("string" !== typeof month) {
						reject(new TypeError("\"month\" data is not a string"));
					}
				else if ("undefined" === typeof day) {
					reject(new ReferenceError("Missing \"day\" data"));
				}
					else if ("string" !== typeof day) {
						reject(new TypeError("\"day\" data is not a string"));
					}
				else {

					let stmt = this._localStorageObject.prepare(
						"SELECT message, type, _datetime " +
						"FROM logs " +
						"WHERE strftime(\"%Y\", _datetime) = ? AND strftime(\"%m\", _datetime) = ? AND strftime(\"%d\", _datetime) = ?;"
					);

					stmt.all(year, month, day, (err, rows) => {

						stmt.finalize();

						if (err) {
							reject(err);
						}
						else {
							resolve(rows);
						}

					});
					
				}

			}).then((rows) => {

				let result = [];

					rows.forEach((row) => {

						result.push({
							date: _formatedDate(new Date(row._datetime)),
							time: _formatedTime(new Date(row._datetime)),
							message: row.message,
							type: row.type
						});

					});

				return Promise.resolve(result);

			});

		}

	// log

		log(msg) {

			if (this._showInConsole) {

				if ("string" === typeof msg && "" === msg.trim()) {
					(1, console).log("");
				}
				else {
					(1, console).log(_formatedDate(new Date()) + " " + _formatedTime(new Date()), msg);
				}
				
			}

			return _input(this._interfaces, msg, "log");

		}
		
		ok(msg) {

			if (this._showInConsole) {

				if ("string" === typeof msg && "" === msg.trim()) {
					(1, console).log("");
				}
				else {
					(1, console).log(_formatedDate(new Date()) + " " + _formatedTime(new Date()), msg.green);
				}
				
			}

			return _input(this._interfaces, msg, "success");

		}
		
			success(msg) {
				return this.ok(msg);
			}
			
		warn(msg) {

			if (this._showInConsole) {

				if ("string" === typeof msg && "" === msg.trim()) {
					(1, console).log("");
				}
				else {
					(1, console).log(_formatedDate(new Date()) + " " + _formatedTime(new Date()), msg.yellow);
				}

			}

			return _input(this._interfaces, msg, "warning");

		}
			
			warning(msg) {
				return this.warn(msg);
			}
			
		err(msg) {

			if (this._showInConsole) {

				if ("string" === typeof msg && "" === msg.trim()) {
					(1, console).log("");
				}
				else {
					(1, console).log(_formatedDate(new Date()) + " " + _formatedTime(new Date()), msg.red);
				}
				
			}

			return _input(this._interfaces, msg, "error");

		}
			
			error(msg) {
				return this.err(msg);
			}
			
		info(msg) {

			if (this._showInConsole) {

				if ("string" === typeof msg && "" === msg.trim()) {
					(1, console).log("");
				}
				else {
					(1, console).log(_formatedDate(new Date()) + " " + _formatedTime(new Date()), msg.cyan);
				}
				
			}

			return _input(this._interfaces, msg, "info");

		}
		
};
