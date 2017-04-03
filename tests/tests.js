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

	it("should check getLogs", () =>  {

		return logs.getLogs().then((rows) => {

			let date = new Date();

			assert.deepEqual(
				[
					{
						year: date.getFullYear() + "",
						month: ((9 < date.getMonth() + 1) ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)) + "",
						day: ((9 < date.getDate()) ? date.getDate() : "0" + date.getDate()) + ""
					}
				],
				rows,
				"returned value is not the current date"
			);

			return Promise.resolve();

		});

	});

	it("should return registered log files", () =>  {

		/*

		return logs.getLogs().then((logs) =>  {

			assert.strictEqual(true, logs instanceof Object, "returned value is not an Object");
			assert.strictEqual(true, logs[sYear] && logs[sYear] instanceof Object, "returned value is not an Object with year");
			assert.strictEqual(true, logs[sYear][sMonth] && logs[sYear][sMonth] instanceof Object, "returned value is not an Object with month");
			assert.strictEqual(true, logs[sYear][sMonth][sDay] && logs[sYear][sMonth][sDay] instanceof Object, "returned value is not an Object with day");

			return logs.read(sYear, sMonth, sDay, 1);

		}).then((txt) =>  {

			assert.strictEqual("string", typeof txt, "returned value is not a string");
			assert.strictEqual("<table class=\"node-logs\">", txt.substring(0, "<table class=\"node-logs\">".length), "returned value is not correctely formated");
			assert.strictEqual("</table>", txt.substring(txt.length - "</table>".length, txt.length), "returned value is not correctely formated");

		});

		*/

	});

});

describe("delete", () =>  {

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

	/*it("should delete logs for an entiere day", () =>  {
		return logs.removeDay(sYear, sMonth, sDay);
	});*/

});
