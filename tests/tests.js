"use strict";

// deps

	const path = require("path");
	const fs = require("fs");
	const assert = require("assert");
	const NodeLogs = require(path.join(__dirname, "..", "dist", "main.js"));

// private

	// attrs

		var dirDB = path.join(__dirname, "logs.db");
		var logs = new NodeLogs();

describe("accessors", () => {

	describe("deleteLogsAfterXDays", () => {

		it("should check empty value", () => {
			assert.throws(() => { logs.deleteLogsAfterXDays(); }, ReferenceError, "check empty value does not throw an error");
		});

		it("should check wrong type value", () => {
			assert.throws(() => { logs.deleteLogsAfterXDays(false); }, TypeError, "check empty value does not throw an error");
		});

		it("should check right type value", () => {
			assert.doesNotThrow(() => { logs.deleteLogsAfterXDays(600); }, Error, "check type value throw an error");
		});

	});

	describe("localStorageDatabase", () => {

		it("should check empty value", () => {
			assert.throws(() => { logs.localStorageDatabase(); }, ReferenceError, "check empty value does not throw an error");
		});

		it("should check wrong type value", () => {
			assert.throws(() => { logs.localStorageDatabase(false); }, TypeError, "check empty value does not throw an error");
		});

		it("should check write type value", () => {
			assert.doesNotThrow(() => { logs.localStorageDatabase(dirDB); }, Error, "check type value throw an error");
		});

	});

	describe("localStorageDatabase", () => {

		it("should check empty value", () => {
			assert.throws(() => { logs.showInConsole(); }, ReferenceError, "check empty value does not throw an error");
		});

		it("should check wrong type value", () => {
			assert.throws(() => { logs.showInConsole("test"); }, TypeError, "check empty value does not throw an error");
		});

		it("should check write type value", () => {
			assert.doesNotThrow(() => { logs.showInConsole(true); }, Error, "check type value throw an error");
		});

	});

});

describe("write", () => {

	before(() => {

		return new Promise((resolve, reject) => {

			fs.lstat(dirDB, (err, stats) => {

				if (err) {

					if (err.code && "ENOENT" === err.code) {
						resolve(false);
					}
					else {
						reject(err);
					}
					
				}
				else {
					resolve(stats.isFile());
				}

			});

		}).then((isFile) => {

			if (!isFile) {
				return Promise.resolve();
			}
			else {

				return new Promise((resolve, reject) => {

					fs.unlink(dirDB, (err) => {

						if (err) {
							reject(err);
						}
						else {
							resolve();
						}

					});

				});
				
			}

		}).then(() => {

			return logs
				.localStorageDatabase(dirDB)
				.deleteLogsAfterXDays(600)
				.showInConsole(true)
				.init();

		});

	});

	it("should test log function", () => {

		return logs.log("log").then(() => {
			return logs.log({ test: "test" });
		}).then(() => {
			return logs.log([ "01", "02", "03" ]);
		});

	});

	it("should test info function", () => {

		return logs.info("info");

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

describe("read", () =>  {

	describe("getLogs", () =>  {

		it("should check getLogs", () =>  {

			return logs.getLogs().then((data) => {

				let date = new Date();

				assert.deepEqual(
					[
						{
							year: date.getFullYear() + "",
							month: ((9 < date.getMonth() + 1) ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)) + "",
							day: ((9 < date.getDate()) ? date.getDate() : "0" + date.getDate()) + ""
						}
					],
					data,
					"returned value is not the current date"
				);

				return Promise.resolve();

			});

		});

	});

	describe("readLog", () =>  {

		after(() => { 

			return logs.release().then(() => {

				fs.unlink(dirDB, (err) => {

					if (err) {
						reject(err);
					}
					else {
						resolve();
					}

				});

			});
	 	});

		it("should return registered log files", () =>  {

			return logs.getLogs().then((data) =>  {
				return logs.readLog(data[0].year, data[0].month, data[0].day);
			}).then((data) =>  {
				assert.strictEqual("object", typeof data, "returned value is not an object");
				return Promise.resolve();
			});

		});

	});

});
