"use strict";

// deps

	// natives
	const { strictEqual } = require("assert");

	// locals
	const input = require(require("path").join(__dirname, "..", "lib", "input.js"));

// tests

describe("input", () => {

	describe("interfaces", () => {

		it("should test missing interfaces", () => {

			return new Promise((resolve, reject) => {

				input().then(() => {
					reject(new Error("No error generated"));
				}).catch((err) => {

					strictEqual(typeof err, "object", "returned value is not a valid error");
					strictEqual(err instanceof ReferenceError, true, "returned value is not a valid error");

					resolve();

				});

			});

		});

		it("should test wrong interfaces", () => {

			return new Promise((resolve, reject) => {

				input(false).then(() => {
					reject(new Error("No error generated"));
				}).catch((err) => {

					strictEqual(typeof err, "object", "returned value is not a valid error");
					strictEqual(err instanceof TypeError, true, "returned value is not a valid error");

					resolve();

				});

			});

		});

	});

	describe("message", () => {

		it("should test missing message", () => {

			return new Promise((resolve, reject) => {

				input([ "test" ]).then(() => {
					reject(new Error("No error generated"));
				}).catch((err) => {

					strictEqual(typeof err, "object", "returned value is not a valid error");
					strictEqual(err instanceof ReferenceError, true, "returned value is not a valid error");

					resolve();

				});

			});

		});

		it("should test wrong message", () => {

			return new Promise((resolve, reject) => {

				input([ "test" ], false).then(() => {
					reject(new Error("No error generated"));
				}).catch((err) => {

					strictEqual(typeof err, "object", "returned value is not a valid error");
					strictEqual(err instanceof TypeError, true, "returned value is not a valid error");

					resolve();

				});

			});

		});

	});

	describe("type", () => {

		it("should test missing type", () => {

			return new Promise((resolve, reject) => {

				input([ "test" ], "test").then(() => {
					reject(new Error("No error generated"));
				}).catch((err) => {

					strictEqual(typeof err, "object", "returned value is not a valid error");
					strictEqual(err instanceof ReferenceError, true, "returned value is not a valid error");

					resolve();

				});

			});

		});

		it("should test wrong type", () => {

			return new Promise((resolve, reject) => {

				input([ "test" ], "test", false).then(() => {
					reject(new Error("No error generated"));
				}).catch((err) => {

					strictEqual(typeof err, "object", "returned value is not a valid error");
					strictEqual(err instanceof TypeError, true, "returned value is not a valid error");

					resolve();

				});

			});

		});

		it("should test wrong type", () => {

			return new Promise((resolve, reject) => {

				input([ "test" ], "test", "test").then(() => {
					reject(new Error("No error generated"));
				}).catch((err) => {

					strictEqual(typeof err, "object", "returned value is not a valid error");
					strictEqual(err instanceof TypeError, true, "returned value is not a valid error");

					resolve();

				});

			});

		});

	});

});
