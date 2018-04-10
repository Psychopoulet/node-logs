/*
	eslint no-implicit-globals: 0, init-declarations: 0
*/

"use strict";

// private

	// methods

		/**
		* Execute interfaces
		* @param {Array} interfaces all interfaces
		* @param {integer} i interfaces pointer
		* @param {string} msg message to log
		* @param {string} type log type
		* @returns {Promise} Ooperation result
		*/
		function _inputInterfaces (interfaces, i, msg, type) {

			return i >= interfaces.length ? Promise.resolve() : Promise.resolve().then(() => {

				let result;

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

						default:
							result = null;
						break;

					}

				return !result ? Promise.resolve() : Promise.resolve().then(() => {

					if ("boolean" === typeof result) {

						return result ? Promise.resolve() : Promise.reject(
							new Error("Impossible to log \"" + msg + "\" message with \"" + type + "\" type on all the interfaces")
						);

					}
					else {
						return "object" === typeof result && result instanceof Promise ? result : Promise.resolve();
					}

				}).then(() => {
					return _inputInterfaces(interfaces, i + 1, msg, type);
				});

			});

		}

// module

module.exports = (interfaces, message, type) => {

	if ("undefined" === typeof interfaces) {
		return Promise.reject(new ReferenceError("Missing \"interfaces\" data"));
	}
		else if ("object" !== typeof interfaces || !(interfaces instanceof Array)) {
			return Promise.reject(new TypeError("\"interfaces\" data is not an Array"));
		}
		else if (0 >= interfaces.length) {
			return Promise.resolve();
		}
	else if ("undefined" === typeof message) {
		return Promise.reject(new ReferenceError("Missing \"message\" data"));
	}
		else if ("string" !== typeof message && "object" !== typeof message) {
			return Promise.reject(new TypeError("\"message\" data is not a string or an object"));
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
		return _inputInterfaces(interfaces, 0, "object" === typeof message ? JSON.stringify(message) : message, type);
	}

};
