"use strict";

// deps

	const { join } = require("path");

	const unlink = require(join(__dirname, "unlink.js"));

	const NodeLogs = require(join(__dirname, "..", "lib", "main.js"));

// consts

	const LOCAL_STORAGE = join(__dirname, "logs.db");
	const logs = new NodeLogs();

describe("write", () => {

	before(() => {

		return unlink(LOCAL_STORAGE).then(() => {

			logs
				.localStorageDatabase(LOCAL_STORAGE)
				.deleteLogsAfterXDays(600)
				.showInConsole(true);

			return Promise.resolve();

		});

	});

	after(() => {
		return unlink(LOCAL_STORAGE);
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
			return logs.log({ "test": "test" });
		}).then(() => {
			return logs.log([ "01", "02", "03" ]);
		});

	});

	it("should test information functions", () => {

		return logs.info("info").then(() => {
			return logs.information("information");
		});

	});

	it("should test success function", () => {

		return logs.ok("ok").then(() => {
			return logs.success("success");
		});

	});

	it("should test warning function", () => {

		return logs.warn("warn").then(() => {
			return logs.warning("warning");
		});

	});

	it("should test error function", () => {

		return logs.err("err").then(() => {
			return logs.error("error");
		});

	});

});
