
"use strict";

// deps

	const { join } = require("path");

	const colors = require("colors");
	const sqlite3 = require("sqlite3");

	const createFile = require(join(__dirname, "createFile.js"));
	const fileExists = require(join(__dirname, "fileExists.js"));
	const input = require(join(__dirname, "input.js"));
	const formateDate = require(join(__dirname, "formateDate.js"));
	const formateTime = require(join(__dirname, "formateTime.js"));

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
			return fileExists(this._localStorageDatabase).then((isFile) => {

				return isFile ? new Promise((resolve) => {
					this._localStorageObject = new sqlite3.Database(this._localStorageDatabase);
					this._localStorageObject.serialize(resolve);
				}) : createFile(this._localStorageDatabase).then(() => {

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

					"log": (msg) => {
						return _localStorage(this._localStorageObject, msg, "log");
					},
					"success": (msg) => {
						return _localStorage(this._localStorageObject, msg, "success");
					},
					"info": (msg) => {
						return _localStorage(this._localStorageObject, msg, "info");
					},
					"warning": (msg) => {
						return _localStorage(this._localStorageObject, msg, "warning");
					},
					"error": (msg) => {
						return _localStorage(this._localStorageObject, msg, "error");
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

			return new Promise((resolve, reject) => {

				this._localStorageObject.close((err) => {
					return err ? reject(err) : resolve();
				});

			}).then(() => {

				this._localStorageObject = null;
				return Promise.resolve();

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
			else if ("undefined" === typeof logInterface.info) {
				return Promise.reject(new ReferenceError("Missing \"logInterface.info\" data"));
			}
				else if ("function" !== typeof logInterface.info) {
					return Promise.reject(new TypeError("\"logInterface.info\" data is not a function"));
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

							result.push({
								"date": formateDate(new Date(row._datetime)),
								"time": formateTime(new Date(row._datetime)),
								"message": row.message,
								"type": row.type
							});

						});

					return Promise.resolve(result);

				});

			}

		}

	// log

		log (msg) {

			if (this._showInConsole) {

				if ("string" === typeof msg && "" === msg.trim()) {
					(0, console).log("");
				}
				else {
					(0, console).log(formateDate(new Date()) + " " + formateTime(new Date()), msg);
				}

			}

			return input(this._interfaces, msg, "log");

		}

		ok (msg) {

			if (this._showInConsole) {

				if ("string" === typeof msg && "" === msg.trim()) {
					(0, console).log("");
				}
				else {
					(0, console).log(formateDate(new Date()) + " " + formateTime(new Date()), colors.green(msg));
				}

			}

			return input(this._interfaces, msg, "success");

		}

			success (msg) {
				return this.ok(msg);
			}

		warn (msg) {

			if (this._showInConsole) {

				if ("string" === typeof msg && "" === msg.trim()) {
					(0, console).log("");
				}
				else {
					(0, console).log(formateDate(new Date()) + " " + formateTime(new Date()), colors.yellow(msg));
				}

			}

			return input(this._interfaces, msg, "warning");

		}

			warning (msg) {
				return this.warn(msg);
			}

		err (msg) {

			if (this._showInConsole) {

				if ("string" === typeof msg && "" === msg.trim()) {
					(0, console).log("");
				}
				else {
					(0, console).log(formateDate(new Date()) + " " + formateTime(new Date()), colors.red(msg));
				}

			}

			return input(this._interfaces, msg, "error");

		}

			error (msg) {
				return this.err(msg);
			}

		info (msg) {

			if (this._showInConsole) {

				if ("string" === typeof msg && "" === msg.trim()) {
					(0, console).log("");
				}
				else {
					(0, console).log(formateDate(new Date()) + " " + formateTime(new Date()), colors.cyan(msg));
				}

			}

			return input(this._interfaces, msg, "info");

		}

};
