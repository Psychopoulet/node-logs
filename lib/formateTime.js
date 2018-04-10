
"use strict";

// module

module.exports = (time) => {

	if ("undefined" === typeof time) {
		throw new ReferenceError("Missing \"time\" parameter");
	}
	else if ("object" !== typeof time || !(time instanceof Date)) {
		throw new TypeError("\"time\" parameter is not a Date");
	}

	else {

		const hours = time.getHours();
		const minutes = time.getMinutes();
		const seconds = time.getSeconds();

		let result = "";

			result += 9 < hours ? hours : "0" + hours;
			result += ":";
			result += 9 < minutes ? minutes : "0" + minutes;
			result += ":";
			result += 9 < seconds ? seconds : "0" + seconds;

		return result;

	}

};
