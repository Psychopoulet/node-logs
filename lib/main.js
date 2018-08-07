
"use strict";

// deps

	const { join } = require("path");

	const sqlite3 = require("sqlite3");

// private

	// methods

		const _createFile = require(join(__dirname, "createFile.js"));
		const _fileExists = require(join(__dirname, "fileExists.js"));
		const _input = require(join(__dirname, "input.js"));

		const _console = require(join(__dirname, "console.js"));

		const _formateDate = require(join(__dirname, "formateDate.js"));
		const _formateTime = require(join(__dirname, "formateTime.js"));

// module

module.exports = class NodeLogs {

	constructor () {

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

		deleteLogsAfterXDays (deleteLogsAfterXDays) {

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

		localStorageDatabase (localStorageDatabase) {

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

		showInConsole (showInConsole) {

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

		init () {

			// local storage exists
			return _fileExists(this._localStorageDatabase).then((isFile) => {

				return isFile ? new Promise((resolve) => {
					this._localStorageObject = new sqlite3.Database(this._localStorageDatabase);
					this._localStorageObject.serialize(resolve);
				}) : _createFile(this._localStorageDatabase).then(() => {

					return new Promise((resolve, reject) => {

						this._localStorageObject = new sqlite3.Database(this._localStorageDatabase);
						this._localStorageObject.serialize(() => {

							this._localStorageObject.run(

								"CREATE TABLE logs (" +
									" id INTEGER PRIMARY KEY AUTOINCREMENT," +
									" type VARCHAR(10)," +
									" _datetime DATETIME," +
									" message TEXT" +
								" );"

							, (err) => {
								return err ? reject(err) : resolve();
							});

						});

					});

				});

			// add local storage interface
			}).then(() => {

				/**
				* Generic local storage method
				* @param {object} localStorageObject localStorage manager
				* @param {string} msg message to log
				* @param {string} type log type
				* @returns {Promise} Ooperation result
				*/
				function _localStorage (localStorageObject, msg, type) {

					return new Promise((resolve, reject) => {

						localStorageObject
							.prepare("INSERT INTO logs VALUES (NULL, ?, DATETIME(), ?);")
							.run(type, msg)
							.finalize((err) => {
								return err ? reject(err) : resolve();
							});

					});

				}

				return this.addInterface({

					"log": (msg, options) => {
						return _localStorage(this._localStorageObject, msg, "log", options);
					},
					"success": (msg, options) => {
						return _localStorage(this._localStorageObject, msg, "success", options);
					},
					"information": (msg, options) => {
						return _localStorage(this._localStorageObject, msg, "information", options);
					},
					"warning": (msg, options) => {
						return _localStorage(this._localStorageObject, msg, "warning", options);
					},
					"error": (msg, options) => {
						return _localStorage(this._localStorageObject, msg, "error", options);
					}

				});

			// delete old logs
			}).then(() => {

				return new Promise((resolve, reject) => {

					this._localStorageObject.run(
						"DELETE FROM logs WHERE _datetime <= date('now', '-" + this._deleteLogsAfterXDays + " days');", (err) => {
							return err ? reject(err) : resolve();
					});

				});

			});

		}

		release () {

			return !this._localStorageObject ? Promise.resolve() : new Promise((resolve, reject) => {

				this._localStorageObject.close((err) => {
					return err ? reject(err) : resolve();
				});

			}).then(() => {
				this._localStorageObject = null; return Promise.resolve();
			});

		}

	addInterface (logInterface) {

		// check interface
		if ("undefined" === typeof logInterface) {
			return Promise.reject(new ReferenceError("Missing \"logInterface\" data"));
		}
			else if ("object" !== typeof logInterface) {
				return Promise.reject(new TypeError("\"logInterface\" data is not an object"));
			}

		// check interface components

			// log
			else if ("undefined" === typeof logInterface.log) {
				return Promise.reject(new ReferenceError("Missing \"logInterface.log\" data"));
			}
				else if ("function" !== typeof logInterface.log) {
					return Promise.reject(new TypeError("\"logInterface.log\" data is not a function"));
				}

			// success
			else if ("undefined" === typeof logInterface.success) {
				return Promise.reject(new ReferenceError("Missing \"logInterface.success\" data"));
			}
				else if ("function" !== typeof logInterface.success) {
					return Promise.reject(new TypeError("\"logInterface.success\" data is not a function"));
				}

			// info
			else if ("undefined" === typeof logInterface.information) {
				return Promise.reject(new ReferenceError("Missing \"logInterface.information\" data"));
			}
				else if ("function" !== typeof logInterface.information) {
					return Promise.reject(new TypeError("\"logInterface.information\" data is not a function"));
				}

			// warning
			else if ("undefined" === typeof logInterface.warning) {
				return Promise.reject(new ReferenceError("Missing \"logInterface.warning\" data"));
			}
				else if ("function" !== typeof logInterface.warning) {
					return Promise.reject(new TypeError("\"logInterface.warning\" data is not a function"));
				}

			// error
			else if ("undefined" === typeof logInterface.error) {
				return Promise.reject(new ReferenceError("Missing \"logInterface.error\" data"));
			}
				else if ("function" !== typeof logInterface.error) {
					return Promise.reject(new TypeError("\"logInterface.error\" data is not a function"));
				}

		else {

			return new Promise((resolve) => {
				this._interfaces.push(logInterface); resolve();
			});

		}

	}

	// get logs

		getLogs () {

			return new Promise((resolve, reject) => {

				this._localStorageObject.all(
					"SELECT " +
						"strftime(\"%Y\", _datetime) AS year, strftime(\"%m\", _datetime) AS month, strftime(\"%d\", _datetime) AS day " +
					"FROM logs " +
					"GROUP BY year, month, day;",
					(err, rows) => {
						return err ? reject(err) : resolve(rows);
				});

			});

		}

		readLog (year, month, day) {

			if ("undefined" === typeof year) {
				return Promise.reject(new ReferenceError("Missing \"year\" data"));
			}
				else if ("string" !== typeof year && "number" !== typeof year) {
					return Promise.reject(new TypeError("\"year\" data is not a string or a number"));
				}
				else if ("string" === typeof year && "" === year) {
					return Promise.reject(new Error("\"year\" data is empty"));
				}

			else if ("undefined" === typeof month) {
				return Promise.reject(new ReferenceError("Missing \"month\" data"));
			}
				else if ("string" !== typeof month && "number" !== typeof month) {
					return Promise.reject(new TypeError("\"month\" data is not a string"));
				}
				else if ("string" === typeof month && "" === month) {
					return Promise.reject(new Error("\"month\" data is empty"));
				}

			else if ("undefined" === typeof day) {
				return Promise.reject(new ReferenceError("Missing \"day\" data"));
			}
				else if ("string" !== typeof day && "number" !== typeof day) {
					return Promise.reject(new TypeError("\"day\" data is not a string"));
				}
				else if ("string" === typeof day && "" === day) {
					return Promise.reject(new Error("\"day\" data is empty"));
				}

			else {

				return new Promise((resolve, reject) => {

						const stmt = this._localStorageObject.prepare(
							"SELECT message, type, _datetime " +
							"FROM logs " +
							"WHERE strftime(\"%Y\", _datetime) = ? AND strftime(\"%m\", _datetime) = ? AND strftime(\"%d\", _datetime) = ?;"
						);

						stmt.all(year, month, day, (err, rows) => {

							stmt.finalize();

							return err ? reject(err) : resolve(rows);

						});

				}).then((rows) => {

					const result = [];

						rows.forEach((row) => {

							const date = new Date(row._datetime);

							result.push({
								"date": _formateDate(date),
								"time": _formateTime(date),
								"message": row.message,
								"type": row.type
							});

						});

					return Promise.resolve(result);

				});

			}

		}

	// log

		log (msg, options) {

			return _input(this._interfaces, msg, "log", options).then((message) => {
				return _console(this._showInConsole, "log", message, options);
			});

		}

		info (msg, options) {

			return _input(this._interfaces, msg, "information", options).then((message) => {
				return _console(this._showInConsole, "information", message, options);
			});

		}

			information (msg, options) {
				return this.info(msg, options);
			}

		ok (msg, options) {

			return _input(this._interfaces, msg, "success", options).then((message) => {
				return _console(this._showInConsole, "success", message, options);
			});

		}

			success (msg, options) {
				return this.ok(msg, options);
			}

		warn (msg, options) {

			return _input(this._interfaces, msg, "warning", options).then((message) => {
				return _console(this._showInConsole, "warning", message, options);
			});

		}

			warning (msg, options) {
				return this.warn(msg, options);
			}

		err (msg, options) {

			return _input(this._interfaces, msg, "error", options).then((message) => {
				return _console(this._showInConsole, "error", message, options);
			});

		}

			error (msg, options) {
				return this.err(msg, options);
			}

};
