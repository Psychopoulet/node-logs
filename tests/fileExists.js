"use strict";

// deps

	const { strictEqual } = require("assert");

	const fileExists = require(require("path").join(__dirname, "..", "lib", "fileExists.js"));

describe("fileExists", () => {

	it("should check missing value", (done) => {

		fileExists().then(() => {
			done(new Error("Does not generate an error"));
		}).catch((err) => {

			strictEqual(typeof err, "object", "error generated is not valid");
			strictEqual(err instanceof ReferenceError, true, "error generated is not valid");

			done();

		});

	});

	it("should check wrong value", (done) => {

		fileExists(false).then(() => {
			done(new Error("Does not generate an error"));
		}).catch((err) => {

			strictEqual(typeof err, "object", "error generated is not valid");
			strictEqual(err instanceof TypeError, true, "error generated is not valid");

			done();

		});

	});

	it("should check empty value", (done) => {

		fileExists("").then(() => {
			done(new Error("Does not generate an error"));
		}).catch((err) => {

			strictEqual(typeof err, "object", "error generated is not valid");
			strictEqual(err instanceof Error, true, "error generated is not valid");

			done();

		});

	});

});
