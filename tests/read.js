"use strict";

// deps

	const { join } = require("path");
	const assert = require("assert");

	const unlink = require(join(__dirname, "unlink.js"));

	const NodeLogs = require(join(__dirname, "..", "lib", "main.js"));

// consts

	const LOCAL_STORAGE = join(__dirname, "logs.db");
	const logs = new NodeLogs();

	const date = new Date();

describe("read", () => {

	before(() => {

		return unlink(LOCAL_STORAGE).then(() => {

			logs
				.localStorageDatabase(LOCAL_STORAGE)
				.deleteLogsAfterXDays(600)
				.showInConsole(false);

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

	describe("getLogs", () => {

		it("should check getLogs", () => {

			return logs.log("log").then(() => {
				return logs.getLogs();
			}).then((data) => {

				assert.deepEqual(
					data,
					[
						{
							"year": String(date.getFullYear()),
							"month": 9 < date.getMonth() + 1 ? String(date.getMonth() + 1) : "0" + (date.getMonth() + 1),
							"day": 9 < date.getDate() ? String(date.getDate()) : "0" + date.getDate()
						}
					],
					"returned value is not the current date"
				);

				return Promise.resolve();

			});

		});

	});

	describe("readLog", () => {

		describe("year", () => {

			it("should test missing year", (done) => {

				logs.readLog().then(() => {
					done(new Error("No error generated"));
				}).catch((err) => {

					assert.strictEqual(typeof err, "object", "returned value is not a valid error");
					assert.strictEqual(err instanceof ReferenceError, true, "returned value is not a valid error");

					done();

				});

			});

			it("should test wrong year", (done) => {

				logs.readLog(false).then(() => {
					done(new Error("No error generated"));
				}).catch((err) => {

					assert.strictEqual(typeof err, "object", "returned value is not a valid error");
					assert.strictEqual(err instanceof TypeError, true, "returned value is not a valid error");

					done();

				});

			});

			it("should test empty year", (done) => {

				logs.readLog("").then(() => {
					done(new Error("No error generated"));
				}).catch((err) => {

					assert.strictEqual(typeof err, "object", "returned value is not a valid error");
					assert.strictEqual(err instanceof Error, true, "returned value is not a valid error");

					done();

				});

			});

		});

		describe("month", () => {

			it("should test missing month", (done) => {

				logs.readLog(date.getFullYear()).then(() => {
					done(new Error("No error generated"));
				}).catch((err) => {

					assert.strictEqual(typeof err, "object", "returned value is not a valid error");
					assert.strictEqual(err instanceof ReferenceError, true, "returned value is not a valid error");

					done();

				});

			});

			it("should test wrong month", (done) => {

				logs.readLog(date.getFullYear(), false).then(() => {
					done(new Error("No error generated"));
				}).catch((err) => {

					assert.strictEqual(typeof err, "object", "returned value is not a valid error");
					assert.strictEqual(err instanceof TypeError, true, "returned value is not a valid error");

					done();

				});

			});

			it("should test empty month", (done) => {

				logs.readLog(date.getFullYear(), "").then(() => {
					done(new Error("No error generated"));
				}).catch((err) => {

					assert.strictEqual(typeof err, "object", "returned value is not a valid error");
					assert.strictEqual(err instanceof Error, true, "returned value is not a valid error");

					done();

				});

			});

		});

		describe("day", () => {

			it("should test missing day", (done) => {

				logs.readLog(date.getFullYear(), date.getMonth() + 1).then(() => {
					done(new Error("No error generated"));
				}).catch((err) => {

					assert.strictEqual(typeof err, "object", "returned value is not a valid error");
					assert.strictEqual(err instanceof ReferenceError, true, "returned value is not a valid error");

					done();

				});

			});

			it("should test wrong day", (done) => {

				logs.readLog(date.getFullYear(), date.getMonth() + 1, false).then(() => {
					done(new Error("No error generated"));
				}).catch((err) => {

					assert.strictEqual(typeof err, "object", "returned value is not a valid error");
					assert.strictEqual(err instanceof TypeError, true, "returned value is not a valid error");

					done();

				});

			});

			it("should test empty day", (done) => {

				logs.readLog(date.getFullYear(), date.getMonth() + 1, "").then(() => {
					done(new Error("No error generated"));
				}).catch((err) => {

					assert.strictEqual(typeof err, "object", "returned value is not a valid error");
					assert.strictEqual(err instanceof Error, true, "returned value is not a valid error");

					done();

				});

			});

		});

		it("should return registered log files", () => {

			return logs.getLogs().then((data) => {
				return logs.readLog(data[0].year, data[0].month, data[0].day);
			}).then((data) => {
				assert.strictEqual(typeof data, "object", "returned value is not an object");
				return Promise.resolve();
			});

		});

	});

});
