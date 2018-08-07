
"use strict";

// module

module.exports = (date) => {

	const month = date.getMonth() + 1;
	const day = date.getDate();

	let result = "";

		result += date.getFullYear();
		result += "-";
		result += 9 < month ? month : "0" + month;
		result += "-";
		result += 9 < day ? day : "0" + day;

	return result;

};
