
"use strict";

// module

module.exports = (date) => {

	if ("undefined" === typeof date) {
		throw new ReferenceError("Missing \"date\" parameter");
	}
	else if ("object" !== typeof date || !(date instanceof Date)) {
		throw new TypeError("\"date\" parameter is not a Date");
	}

	else {

		const month = date.getMonth() + 1;
		const day = date.getDate();

		let result = "";

			result += date.getFullYear();
			result += "-";
			result += 9 < month ? month : "0" + month;
			result += "-";
			result += 9 < day ? day : "0" + day;

		return result;

	}

};
