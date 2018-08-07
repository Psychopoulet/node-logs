
"use strict";

// deps

	const colors = require("colors");

// private

	// methods

		const _formateDateTime = require(require("path").join(__dirname, "formateDateTime.js"));

// module

module.exports = (showInConsole, type, msg, options = []) => {

	return !showInConsole ? Promise.resolve() : Promise.resolve().then(() => {

		if ("" === msg.trim()) {
			(0, console).log("");
		}
		else {

			const date = _formateDateTime(new Date());

			switch (type) {

				case "information":
					(0, console).log(date, colors.cyan(msg));
				break;

				case "success":
					(0, console).log(date, colors.green(msg));
				break;

				case "warning":
					(0, console).log(date, colors.yellow(msg));
				break;

				case "error":
					(0, console).log(date, colors.red(msg));
				break;

				default:
					(0, console).log(date, msg);
				break;

			}

		}

		return Promise.resolve();

	});

};
