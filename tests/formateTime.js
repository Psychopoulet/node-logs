"use strict";

// deps

	const assert = require("assert");

	const formateTime = require(require("path").join(__dirname, "..", "lib", "formateTime.js"));

// consts

	const TESTED_DATE = new Date(1988, 3 - 1, 6, 16, 30, 15);

describe("formateTime", () => {

	it("should check basic value", () => {

		assert.doesNotThrow(() => {
			formateTime(TESTED_DATE);
		}, Error, "Generate an error");

		const formatedDate = formateTime(TESTED_DATE);

		assert.strictEqual(typeof formatedDate, "string", "data generated is not valid");
		assert.strictEqual(formatedDate, "16:30:15", "data generated is not valid");

	});

	it("should check short hour & minute & second", () => {

		const date = new Date(TESTED_DATE);
		date.setHours(9);
		date.setMinutes(5);
		date.setSeconds(5);

		const formatedDate = formateTime(date);

		assert.strictEqual(typeof formatedDate, "string", "data generated is not valid");
		assert.strictEqual(formatedDate, "09:05:05", "data generated is not valid");

	});

	it("should check long hour & minute & second", () => {

		const formatedDate = formateTime(TESTED_DATE);

		assert.strictEqual(typeof formatedDate, "string", "data generated is not valid");
		assert.strictEqual(formatedDate, "16:30:15", "data generated is not valid");

	});

});
