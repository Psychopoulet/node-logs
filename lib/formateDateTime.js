
"use strict";

// deps

	const { join } = require("path");

	const formateDate = require(join(__dirname, "formateDate.js"));
	const formateTime = require(join(__dirname, "formateTime.js"));

// module

module.exports = (date) => {

	if ("undefined" === typeof date) {
		throw new ReferenceError("Missing \"date\" parameter");
	}
	else if ("object" !== typeof date || !(date instanceof Date)) {
		throw new TypeError("\"date\" parameter is not a Date");
	}

	else {

		return formateDate(date) + " " + formateTime(date);

	}

};
