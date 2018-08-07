"use strict";

// deps

	const { strictEqual } = require("assert");

	const createFile = require(require("path").join(__dirname, "..", "lib", "createFile.js"));

describe("createFile", () => {

	it("should check missing value", (done) => {

		createFile().then(() => {
			done(new Error("Does not generate an error"));
		}).catch((err) => {

			strictEqual(typeof err, "object", "error generated is not valid");
			strictEqual(err instanceof ReferenceError, true, "error generated is not valid");

			done();

		});

	});

	it("should check wrong value", (done) => {

		createFile(false).then(() => {
			done(new Error("Does not generate an error"));
		}).catch((err) => {

			strictEqual(typeof err, "object", "error generated is not valid");
			strictEqual(err instanceof TypeError, true, "error generated is not valid");

			done();

		});

	});

	it("should check empty value", (done) => {

		createFile("").then(() => {
			done(new Error("Does not generate an error"));
		}).catch((err) => {

			strictEqual(typeof err, "object", "error generated is not valid");
			strictEqual(err instanceof Error, true, "error generated is not valid");

			done();

		});

	});

});
