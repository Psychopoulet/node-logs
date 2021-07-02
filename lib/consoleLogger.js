"use strict";

// deps

	// externals
	const colors = require("colors");

	// locals
	const formateDateTime = require(require("path").join(__dirname, "formateDateTime.js"));

// module

module.exports = function consoleLogger (msg, options) {

	if ("" === msg.trim()) {
		(0, console).log("");
	}
	else {

		const date = formateDateTime(new Date());
		let message = msg;

			let typeDetected = false;
			options.forEach((option) => {

				switch (option) {

					// types

						case "log":

							if (!typeDetected) {
								message = options.includes("background") ? colors.inverse(message) : message;
							}

							typeDetected = true;

						break;

						case "information":

							if (!typeDetected) {
								message = options.includes("background") ? colors.bgCyan(message) : colors.cyan(message);
							}

							typeDetected = true;

						break;

						case "success":

							if (!typeDetected) {
								message = options.includes("background") ? colors.bgGreen(message) : colors.green(message);
							}

							typeDetected = true;

						break;

						case "warning":

							if (!typeDetected) {
								message = options.includes("background") ? colors.bgYellow(message) : colors.yellow(message);
							}

							typeDetected = true;

						break;

						case "error":

							if (!typeDetected) {
								message = options.includes("background") ? colors.bgRed(message) : colors.red(message);
							}

							typeDetected = true;

						break;

					// options

						case "bold":
							message = colors.bold(message);
						break;

						case "italic":
							message = colors.italic(message);
						break;

						case "strikethrough":
							message = colors.strikethrough(message);
						break;

						case "underline":
							message = colors.underline(message);
						break;

					default:
						// nothing to do here
					break;

				}

			});

		(0, console).log(date, message);

	}

};
