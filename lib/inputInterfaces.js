/*
	eslint max-params: 0
*/

"use strict";

// private

	// methods

		/**
		* Execute interfaces
		* @param {Array} interfaces all interfaces
		* @param {string} msg message to log
		* @param {string} type log type
		* @param {null|object} options style options
		* @param {number} i cursor
		* @returns {Promise} Operation result
		*/
		function _inputInterfaces (interfaces, msg, type, options, i = 0) {

			return i >= interfaces.length ? Promise.resolve() : Promise.resolve().then(() => {

				let result = null;

					switch (type) {

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
							result = interfaces[i].log(msg, options);
						break;

					}

				return Promise.resolve().then(() => {

					if ("boolean" === typeof result) {

						return result ? Promise.resolve() : Promise.reject(
							new Error("Impossible to log \"" + msg + "\" message with \"" + type + "\" type on all the interfaces")
						);

					}
					else {
						return "object" === typeof result && result instanceof Promise ? result : Promise.resolve();
					}

				}).then(() => {
					return _inputInterfaces(interfaces, msg, type, options, i + 1);
				});

			});

		}

// module

module.exports = _inputInterfaces;
