"use strict";

// deps

	const { join } = require("path");
	const assert = require("assert");

	const NodeLogs = require(join(__dirname, "..", "lib", "main.js"));

// consts

	const LOCAL_STORAGE = join(__dirname, "logs.db");
	const logs = new NodeLogs();

describe("accessors", () => {

	describe("deleteLogsAfterXDays", () => {

		it("should check empty value", () => {

			assert.throws(() => {
				logs.deleteLogsAfterXDays();
			}, ReferenceError, "check empty value does not throw an error");

		});

		it("should check wrong type value", () => {

			assert.throws(() => {
				logs.deleteLogsAfterXDays(false);
			}, TypeError, "check empty value does not throw an error");

		});

		it("should check right type value", () => {

			assert.doesNotThrow(() => {
				logs.deleteLogsAfterXDays(600);
			}, Error, "check type value throw an error");

		});

	});

	describe("localStorageDatabase", () => {

		it("should check empty value", () => {

			assert.throws(() => {
				logs.localStorageDatabase();
			}, ReferenceError, "check empty value does not throw an error");

		});

		it("should check wrong type value", () => {

			assert.throws(() => {
				logs.localStorageDatabase(false);
			}, TypeError, "check empty value does not throw an error");

		});

		it("should check write type value", () => {

			assert.doesNotThrow(() => {
				logs.localStorageDatabase(LOCAL_STORAGE);
			}, Error, "check type value throw an error");

		});

	});

	describe("localStorageDatabase", () => {

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
