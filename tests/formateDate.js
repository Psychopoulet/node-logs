"use strict";

// deps

	const assert = require("assert");

	const formateDate = require(require("path").join(__dirname, "..", "lib", "formateDate.js"));

// consts

	const TESTED_DATE = new Date(1988, 3 - 1, 6, 16, 30, 15);

describe("formateDate", () => {

	it("should check basic value", () => {

		assert.doesNotThrow(() => {
			formateDate(TESTED_DATE);
		}, Error, "Generate an error");

		const formatedDate = formateDate(TESTED_DATE);

		assert.strictEqual(typeof formatedDate, "string", "data generated is not valid");
		assert.strictEqual(formatedDate, "1988-03-06", "data generated is not valid");

	});

	it("should check short day & month", () => {

		const date = new Date(TESTED_DATE);
		date.setMonth(9 - 1);
		date.setDate(9);

		const formatedDate = formateDate(date);

		assert.strictEqual(typeof formatedDate, "string", "data generated is not valid");
		assert.strictEqual(formatedDate, "1988-09-09", "data generated is not valid");

	});

	it("should check long day & month", () => {

		const date = new Date(TESTED_DATE);
		date.setMonth(10 - 1);
		date.setDate(10);

		const formatedDate = formateDate(date);

		assert.strictEqual(typeof formatedDate, "string", "data generated is not valid");
		assert.strictEqual(formatedDate, "1988-10-10", "data generated is not valid");

	});

});
