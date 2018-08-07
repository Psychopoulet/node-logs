
"use strict";

// deps

	const { join } = require("path");

// private

	// methods

	const _formateDate = require(join(__dirname, "formateDate.js"));
	const _formateTime = require(join(__dirname, "formateTime.js"));

// module

module.exports = (date) => {
	return _formateDate(date) + " " + _formateTime(date);
};
