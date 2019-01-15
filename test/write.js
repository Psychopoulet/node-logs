"use strict";

// deps

	// natives
	const { join } = require("path");

	// locals
	const NodeLogs = require(join(__dirname, "..", "lib", "main.js"));

// consts

	const logs = new NodeLogs();

// tests

describe("write", () => {

	before(() => {
		logs.showInConsole(true);
	});

	beforeEach(() => {
		return logs.init();
	});

	afterEach(() => {
		return logs.release();
	});

	it("should test log function", () => {

		return logs.log("").then(() => {
			return logs.log("log");
		}).then(() => {
			return logs.log("log", [ "background" ]);
		}).then(() => {
			return logs.log({ "test": "test" });
		}).then(() => {
			return logs.log([ "01", "02", "03" ]);
		});

	});

	it("should test information functions", () => {

		return logs.info("info").then(() => {
			return logs.information("information");
		}).then(() => {
			return logs.information("information", [ "background" ]);
		});

	});

	it("should test success function", () => {

		return logs.ok("ok").then(() => {
			return logs.success("success");
		}).then(() => {
			return logs.success("success", [ "background" ]);
		});

	});

	it("should test warning function", () => {

		return logs.warn("warn").then(() => {
			return logs.warning("warning");
		}).then(() => {
			return logs.warning("warning", [ "background" ]);
		});

	});

	it("should test error function", () => {

		return logs.err("err").then(() => {
			return logs.error("error");
		}).then(() => {
			return logs.error("error", [ "background" ]);
		});

	});

});
