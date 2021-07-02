"use strict";

// module

module.exports = function formateDateTime (data) {

	const month = data.getMonth() + 1;
	const day = data.getDate();

	let date = "";

		date += data.getFullYear();
		date += "-";
		date += 9 < month ? month : "0" + month;
		date += "-";
		date += 9 < day ? day : "0" + day;

	const hours = data.getHours();
	const minutes = data.getMinutes();
	const seconds = data.getSeconds();

	let time = "";

		time += 9 < hours ? hours : "0" + hours;
		time += ":";
		time += 9 < minutes ? minutes : "0" + minutes;
		time += ":";
		time += 9 < seconds ? seconds : "0" + seconds;

	return date + " " + time;
};
