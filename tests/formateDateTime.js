"use strict";

// deps

	const assert = require("assert");

	const formateDateTime = require(require("path").join(__dirname, "..", "lib", "formateDateTime.js"));

// consts

	const TESTED_DATE = new Date(1988, 3 - 1, 6, 16, 30, 15);

describe("formateDateTime", () => {

	it("should check basic value", () => {

		assert.doesNotThrow(() => {
			formateDateTime(TESTED_DATE);
		}, Error, "Generate an error");

		const formatedDate = formateDateTime(TESTED_DATE);

		assert.strictEqual(typeof formatedDate, "string", "data generated is not valid");
		assert.strictEqual(formatedDate, "1988-03-06 16:30:15", "data generated is not valid");

	});

	it("should check short day & month && hour & minute & second", () => {

		const date = new Date(TESTED_DATE);
		date.setMonth(9 - 1);
		date.setDate(9);
		date.setHours(9);
		date.setMinutes(5);
		date.setSeconds(5);

		const formatedDate = formateDateTime(date);

		assert.strictEqual(typeof formatedDate, "string", "data generated is not valid");
		assert.strictEqual(formatedDate, "1988-09-09 09:05:05", "data generated is not valid");

	});

	it("should check long day & month", () => {

		const date = new Date(TESTED_DATE);
		date.setMonth(10 - 1);
		date.setDate(10);
		date.setHours(10);
		date.setMinutes(10);
		date.setSeconds(10);

		const formatedDate = formateDateTime(date);

		assert.strictEqual(typeof formatedDate, "string", "data generated is not valid");
		assert.strictEqual(formatedDate, "1988-10-10 10:10:10", "data generated is not valid");

	});

});
