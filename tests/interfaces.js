"use strict";

// deps

	const { join } = require("path");

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

	describe("info", () => {

		it("should add interface without \"info\"", () => {

			return logs.addInterface({
				"log": emptyHandler,
				"success": emptyHandler
			}).catch((err) => {

				return err instanceof ReferenceError && "Missing \"logInterface.info\" data" === err.message ?
					Promise.resolve() :
					Promise.reject(err);

			});

		});

		it("should add interface with wrong \"info\"", () => {

			return logs.addInterface({
				"log": emptyHandler,
				"success": emptyHandler,
				"info": false
			}).catch((err) => {

				return err instanceof TypeError && "\"logInterface.info\" data is not a function" === err.message ?
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
				"info": emptyHandler
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
				"info": emptyHandler,
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
				"info": emptyHandler,
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
				"info": emptyHandler,
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
					(0, console).log(msg);
				},
				"success": () => {
					return true;
				},
				"info": emptyHandler,
				"warning": emptyHandler,
				"error": emptyHandler
			}).then(() => {
				return logs.log("test");
			});

		});

		it("should test interface wright", () => {
			return logs.success("test");
		});

	});

});
