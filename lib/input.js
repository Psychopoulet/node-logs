/*
	eslint no-implicit-globals: 0, init-declarations: 0
*/

"use strict";

// consts

	const TYPES = [ "log", "success", "information", "warning", "error" ];
	const OPTIONS = [ "background", "bold", "italic", "strikethrough", "underline" ];

// private

	// methods

		/**
		* Execute interfaces
		* @param {Array} interfaces all interfaces
		* @param {integer} i interfaces pointer
		* @param {string} msg message to log
		* @param {string} type log type
		* @param {null|object} options style options
		* @returns {Promise} Ooperation result
		*/
		function _inputInterfaces (interfaces, i, msg, type, options) {

			return i >= interfaces.length ? Promise.resolve() : Promise.resolve().then(() => {

				let result = null;

					switch (type) {

						case "log":
							result = interfaces[i].log(msg, options);
						break;
						case "success":
							result = interfaces[i].success(msg, options);
						break;
						case "information":
							result = interfaces[i].information(msg, options);
						break;
						case "warning":
							result = interfaces[i].warning(msg, options);
						break;
						case "error":
							result = interfaces[i].error(msg, options);
						break;

						default:
							// nothing to do here
						break;

					}

				return null === result ? Promise.resolve() : Promise.resolve().then(() => {

					if ("boolean" === typeof result) {

						return result ? Promise.resolve() : Promise.reject(
							new Error("Impossible to log \"" + msg + "\" message with \"" + type + "\" type on all the interfaces")
						);

					}
					else {
						return "object" === typeof result && result instanceof Promise ? result : Promise.resolve();
					}

				}).then(() => {
					return _inputInterfaces(interfaces, i + 1, msg, type, options);
				});

			});

		}

// module

module.exports = (interfaces, message, type, options = []) => {

	if ("undefined" === typeof interfaces) {
		return Promise.reject(new ReferenceError("Missing \"interfaces\" data"));
	}
		else if ("object" !== typeof interfaces || !(interfaces instanceof Array)) {
			return Promise.reject(new TypeError("\"interfaces\" data is not an Array"));
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
		else if (!TYPES.includes(type)) {
			return Promise.reject(new TypeError("\"type\" data is not in [ \"" + TYPES.join("\", \"") + "\" ] "));
		}

	else {

		return Promise.resolve().then(() => {

			return "object" === typeof options && options instanceof Array ? Promise.resolve() :
				Promise.reject(new TypeError("\"options\" data is not an Array"));

		}).then(() => {

			const msg = "object" === typeof message ? JSON.stringify(message) : message;

			return _inputInterfaces(interfaces, 0, msg, type, options.filter((option) => {
				return "string" === typeof option && OPTIONS.includes(option);
			})).then(() => {
				return Promise.resolve(msg);
			});

		});

	}

};
