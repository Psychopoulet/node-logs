"use strict";

// deps

	const { join } = require("path");
	const { strictEqual } = require("assert");

	const emptyHandler = require(join(__dirname, "emptyHandler.js"));

	const NodeLogs = require(join(__dirname, "..", "lib", "main.js"));

// consts

	const logs = new NodeLogs();

describe("interfaces", () => {

	beforeEach(() => {
		return logs.init();
	});

	afterEach(() => {
		return logs.release();
	});

	it("should check empty value", () => {

		return logs.addInterface().catch((err) => {
			return err instanceof ReferenceError && "Missing \"logInterface\" data" === err.message ? Promise.resolve() : Promise.reject(err);
		});

	});

	it("should check wrong type value", () => {

		return logs.addInterface(false).catch((err) => {
			return err instanceof TypeError && "\"logInterface\" data is not an object" === err.message ? Promise.resolve() : Promise.reject(err);
		});

	});

	describe("log", () => {

		it("should add interface without \"log\"", () => {

			return logs.addInterface({

			}).catch((err) => {

				return err instanceof ReferenceError && "Missing \"logInterface.log\" data" === err.message ?
					Promise.resolve() :
					Promise.reject(err);

			});

		});

		it("should add interface with wrong \"log\"", () => {

			return logs.addInterface({
				"log": false
			}).catch((err) => {

				return err instanceof TypeError && "\"logInterface.log\" data is not a function" === err.message ?
					Promise.resolve() :
					Promise.reject(err);

			});

		});

	});

	describe("success", () => {

		it("should add interface without \"success\"", () => {

			return logs.addInterface({
				"log": emptyHandler
			}).catch((err) => {

				return err instanceof ReferenceError && "Missing \"logInterface.success\" data" === err.message ?
					Promise.resolve() :
					Promise.reject(err);

			});

		});

		it("should add interface with wrong \"success\"", () => {

			return logs.addInterface({
				"log": emptyHandler,
				"success": false
			}).catch((err) => {

				return err instanceof TypeError && "\"logInterface.success\" data is not a function" === err.message ?
					Promise.resolve() :
					Promise.reject(err);

			});

		});

	});

	describe("information", () => {

		it("should add interface without \"information\"", () => {

			return logs.addInterface({
				"log": emptyHandler,
				"success": emptyHandler
			}).catch((err) => {

				return err instanceof ReferenceError && "Missing \"logInterface.information\" data" === err.message ?
					Promise.resolve() :
					Promise.reject(err);

			});

		});

		it("should add interface with wrong \"information\"", () => {

			return logs.addInterface({
				"log": emptyHandler,
				"success": emptyHandler,
				"information": false
			}).catch((err) => {

				return err instanceof TypeError && "\"logInterface.information\" data is not a function" === err.message ?
					Promise.resolve() :
					Promise.reject(err);

			});

		});

	});

	describe("warning", () => {

		it("should add interface without \"warning\"", () => {

			return logs.addInterface({
				"log": emptyHandler,
				"success": emptyHandler,
				"information": emptyHandler
			}).catch((err) => {

				return err instanceof ReferenceError && "Missing \"logInterface.warning\" data" === err.message ?
					Promise.resolve() :
					Promise.reject(err);

			});

		});

		it("should add interface with wrong \"warning\"", () => {

			return logs.addInterface({
				"log": emptyHandler,
				"success": emptyHandler,
				"information": emptyHandler,
				"warning": false
			}).catch((err) => {

				return err instanceof TypeError && "\"logInterface.warning\" data is not a function" === err.message ?
					Promise.resolve() :
					Promise.reject(err);

			});

		});

	});

	describe("error", () => {

		it("should add interface without \"error\"", () => {

			return logs.addInterface({
				"log": emptyHandler,
				"success": emptyHandler,
				"information": emptyHandler,
				"warning": emptyHandler
			}).catch((err) => {

				return err instanceof ReferenceError && "Missing \"logInterface.error\" data" === err.message ?
					Promise.resolve() :
					Promise.reject(err);

			});

		});

		it("should add interface with wrong \"error\"", () => {

			return logs.addInterface({
				"log": emptyHandler,
				"success": emptyHandler,
				"information": emptyHandler,
				"warning": emptyHandler,
				"error": false
			}).catch((err) => {

				return err instanceof TypeError && "\"logInterface.error\" data is not a function" === err.message ?
					Promise.resolve() :
					Promise.reject(err);

			});

		});

	});

	describe("right", () => {

		it("should test interface", () => {

			return logs.addInterface({
				"log": (msg) => {
					(0, console).log(msg); return Promise.resolve();
				},
				"success": () => {
					return true;
				},
				"information": () => {
					return null;
				},
				"warning": () => {
					return false;
				},
				"error": () => {
					return Promise.reject(new Error("test"));
				}
			});

		});

		it("should test return valid Promise", () => {
			return logs.log("test");
		});

		it("should test return true", () => {
			return logs.success("test");
		});

		it("should test return null", () => {
			return logs.information("test");
		});

		it("should test return false", (done) => {

			logs.warning("test").then(() => {
				done(new Error("No error generated"));
			}).catch((err) => {

				strictEqual(typeof err, "object", "returned value is not a valid error");
				strictEqual(err instanceof Error, true, "returned value is not a valid error");

				done();

			});

		});

		it("should test return bad Promise", (done) => {

			logs.error("test").then(() => {
				done(new Error("No error generated"));
			}).catch((err) => {

				strictEqual(typeof err, "object", "returned value is not a valid error");
				strictEqual(err instanceof Error, true, "returned value is not a valid error");

				done();

			});

		});

	});

});
