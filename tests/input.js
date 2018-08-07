"use strict";

// deps

	const { strictEqual } = require("assert");

	const input = require(require("path").join(__dirname, "..", "lib", "input.js"));

describe("input", () => {

	describe("interfaces", () => {

		it("should test missing interfaces", (done) => {

			input().then(() => {
				done(new Error("No error generated"));
			}).catch((err) => {

				strictEqual(typeof err, "object", "returned value is not a valid error");
				strictEqual(err instanceof ReferenceError, true, "returned value is not a valid error");

				done();

			});

		});

		it("should test wrong interfaces", (done) => {

			input(false).then(() => {
				done(new Error("No error generated"));
			}).catch((err) => {

				strictEqual(typeof err, "object", "returned value is not a valid error");
				strictEqual(err instanceof TypeError, true, "returned value is not a valid error");

				done();

			});

		});

		it("should test empty interfaces", () => {
			return input([]);
		});

	});

	describe("message", () => {

		it("should test missing message", (done) => {

			input([ "test" ]).then(() => {
				done(new Error("No error generated"));
			}).catch((err) => {

				strictEqual(typeof err, "object", "returned value is not a valid error");
				strictEqual(err instanceof ReferenceError, true, "returned value is not a valid error");

				done();

			});

		});

		it("should test wrong message", (done) => {

			input([ "test" ], false).then(() => {
				done(new Error("No error generated"));
			}).catch((err) => {

				strictEqual(typeof err, "object", "returned value is not a valid error");
				strictEqual(err instanceof TypeError, true, "returned value is not a valid error");

				done();

			});

		});

	});

	describe("type", () => {

		it("should test missing type", (done) => {

			input([ "test" ], "test").then(() => {
				done(new Error("No error generated"));
			}).catch((err) => {

				strictEqual(typeof err, "object", "returned value is not a valid error");
				strictEqual(err instanceof ReferenceError, true, "returned value is not a valid error");

				done();

			});

		});

		it("should test wrong type", (done) => {

			input([ "test" ], "test", false).then(() => {
				done(new Error("No error generated"));
			}).catch((err) => {

				strictEqual(typeof err, "object", "returned value is not a valid error");
				strictEqual(err instanceof TypeError, true, "returned value is not a valid error");

				done();

			});

		});

		it("should test wrong type", (done) => {

			input([ "test" ], "test", "test").then(() => {
				done(new Error("No error generated"));
			}).catch((err) => {

				strictEqual(typeof err, "object", "returned value is not a valid error");
				strictEqual(err instanceof TypeError, true, "returned value is not a valid error");

				done();

			});

		});

	});

});
