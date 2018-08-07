
"use strict";

// deps

	const { join } = require("path");

// private

	// methods

		const _input = require(join(__dirname, "input.js"));
		const _console = require(join(__dirname, "console.js"));

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

		log (msg, options = []) {

			return _input(this._interfaces, msg, "log", options).then((message) => {
				options.unshift("log"); return _console(this._showInConsole, message, options);
			});

		}

		info (msg, options = []) {

			return _input(this._interfaces, msg, "information", options).then((message) => {
				options.unshift("information"); return _console(this._showInConsole, message, options);
			});

		}

			information (msg, options = []) {
				return this.info(msg, options);
			}

		ok (msg, options = []) {

			return _input(this._interfaces, msg, "success", options).then((message) => {
				options.unshift("success"); return _console(this._showInConsole, message, options);
			});

		}

			success (msg, options = []) {
				return this.ok(msg, options);
			}

		warn (msg, options = []) {

			return _input(this._interfaces, msg, "warning", options).then((message) => {
				options.unshift("warning"); return _console(this._showInConsole, message, options);
			});

		}

			warning (msg, options = []) {
				return this.warn(msg, options);
			}

		err (msg, options = []) {

			return _input(this._interfaces, msg, "error", options).then((message) => {
				options.unshift("error"); return _console(this._showInConsole, message, options);
			});

		}

			error (msg, options = []) {
				return this.err(msg, options);
			}

};
