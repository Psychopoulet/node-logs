"use strict";

// deps

	// natives
	const { join } = require("path");

	// externals
	const input = require(join(__dirname, "input.js"));
	const consoleLogger = require(join(__dirname, "consoleLogger.js"));

// module

module.exports = class NodeLogs {

	constructor () {

		// direct output
		this._showInConsole = false;

		// other storages interfaces
		this._interfaces = [];

	}

	// accessors

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
			this._interfaces = [];
			return Promise.resolve();
		}

		release () {
			this._interfaces = [];
			return Promise.resolve();
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

	// log

		log (message, options = []) {

			const msg = "object" === typeof message ? JSON.stringify(message) : message;

			if (this._showInConsole) {
				consoleLogger(msg, [ "log", ...options ]);
			}

			return input(this._interfaces, msg, "log", options);

		}

		info (message, options = []) {

			const msg = "object" === typeof message ? JSON.stringify(message) : message;

			if (this._showInConsole) {
				consoleLogger(msg, [ "information", ...options ]);
			}

			return input(this._interfaces, msg, "information", options);
		}

			information (msg, options = []) {
				return this.info(msg, options);
			}

		ok (message, options = []) {

			const msg = "object" === typeof message ? JSON.stringify(message) : message;

			if (this._showInConsole) {
				consoleLogger(msg, [ "success", ...options ]);
			}

			return input(this._interfaces, msg, "success", options);

		}

			success (msg, options = []) {
				return this.ok(msg, options);
			}

		warn (message, options = []) {

			const msg = "object" === typeof message ? JSON.stringify(message) : message;

			if (this._showInConsole) {
				consoleLogger(msg, [ "warning", ...options ]);
			}

			return input(this._interfaces, msg, "warning", options);

		}

			warning (msg, options = []) {
				return this.warn(msg, options);
			}

		err (message, options = []) {

			const msg = "object" === typeof message ? JSON.stringify(message) : message;

			if (this._showInConsole) {
				consoleLogger(msg, [ "error", ...options ]);
			}

			return input(this._interfaces, msg, "error", options);

		}

			error (msg, options = []) {
				return this.err(msg, options);
			}

};
