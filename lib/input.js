"use strict";

// deps

	// locals
	const inputInterfaces = require(require("path").join(__dirname, "inputInterfaces.js"));

// consts

	const TYPES = [ "log", "success", "information", "warning", "error" ];
	const OPTIONS = [ "background", "bold", "italic", "strikethrough", "underline" ];

// module

module.exports = function input (interfaces, message, type, options = []) {

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

			return inputInterfaces(interfaces, message, type, options.filter((option) => {
				return "string" === typeof option && OPTIONS.includes(option);
			}));

		});

	}

};
