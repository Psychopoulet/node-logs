"use strict";

// deps

	const { join } = require("path");
	const assert = require("assert");

	const NodeLogs = require(join(__dirname, "..", "lib", "main.js"));

// consts

	const logs = new NodeLogs();

describe("accessors", () => {

	describe("showInConsole", () => {

		it("should check empty value", () => {

			assert.throws(() => {
				logs.showInConsole();
			}, ReferenceError, "check empty value does not throw an error");

		});

		it("should check wrong type value", () => {

			assert.throws(() => {
				logs.showInConsole("test");
			}, TypeError, "check empty value does not throw an error");

		});

		it("should check write type value", () => {

			assert.doesNotThrow(() => {
				logs.showInConsole(true);
			}, Error, "check type value throw an error");

		});

	});

});
