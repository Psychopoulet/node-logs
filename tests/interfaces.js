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

	describe("wrong options", () => {

		it("should test wrong type options", () => {

			return logs.addInterface({
				"log": emptyHandler,
				"success": emptyHandler,
				"information": emptyHandler,
				"warning": emptyHandler,
				"error": emptyHandler
			}).then(() => {

				return new Promise((resolve, reject) => {

					logs.log("test", false).then(() => {
						reject(new Error("No error generated"));
					}).catch((err) => {

						strictEqual(typeof err, "object", "returned value is not a valid error");
						strictEqual(err instanceof TypeError, true, "returned value is not a valid error");

						resolve();

					});

				});

			});

		});

		it("should test unknown type options", () => {

			return logs.addInterface({
				"log": (msg, options) => {

					return Promise.resolve().then(() => {

						strictEqual(typeof msg, "string", "message sended is not a string");
						strictEqual(msg, "test", "message sended is not as expected");

						strictEqual(typeof options, "object", "options sended is not an object");
						strictEqual(options instanceof Array, true, "options sended is not an Array");
						strictEqual(options.length, 0, "options sended is not as expected");

						return Promise.resolve();

					});

				},
				"success": emptyHandler,
				"information": emptyHandler,
				"warning": emptyHandler,
				"error": emptyHandler
			}).then(() => {
				return logs.log("test", [ "test" ]);
			});

		});

	});

	describe("right", () => {

		beforeEach(() => {
			return logs.init();
		});

		afterEach(() => {
			return logs.release();
		});

		it("should add valid interface", () => {

			return logs.addInterface({
				"log": emptyHandler,
				"success": emptyHandler,
				"information": emptyHandler,
				"warning": emptyHandler,
				"error": emptyHandler
			}).then(() => {
				return logs.log("test");
			}).then(() => {
				return logs.success("test");
			}).then(() => {
				return logs.information("test");
			}).then(() => {
				return logs.warning("test");
			}).then(() => {
				return logs.error("test");
			});

		});

		it("should test return null", () => {

			return logs.addInterface({
				"log": () => {
					return null;
				},
				"success": emptyHandler,
				"information": emptyHandler,
				"warning": emptyHandler,
				"error": emptyHandler
			}).then(() => {
				return logs.log("test");
			});

		});

		it("should test interface with boolean return", () => {

			return logs.addInterface({
				"log": emptyHandler,
				"success": () => {
					return true;
				},
				"information": emptyHandler,
				"warning": emptyHandler,
				"error": () => {
					return false;
				}
			}).then(() => {
				return logs.success("test");
			}).then(() => {

				return new Promise((resolve, reject) => {

					logs.error("test").then(() => {
						reject(new Error("No error generated"));
					}).catch((err) => {

						strictEqual(typeof err, "object", "returned value is not a valid error");
						strictEqual(err instanceof Error, true, "returned value is not a valid error");

						resolve();

					});

				});

			});

		});

		it("should test interface with Promise return", () => {

			return logs.addInterface({
				"log": emptyHandler,
				"success": () => {
					return Promise.resolve();
				},
				"information": emptyHandler,
				"warning": emptyHandler,
				"error": () => {
					return Promise.reject(new Error("test"));
				}
			}).then(() => {
				return logs.success("test");
			}).then(() => {

				return new Promise((resolve, reject) => {

					logs.error("test").then(() => {
						reject(new Error("No error generated"));
					}).catch((err) => {

						strictEqual(typeof err, "object", "returned value is not a valid error");
						strictEqual(err instanceof Error, true, "returned value is not a valid error");

						resolve();

					});

				});

			});

		});

	});

});
