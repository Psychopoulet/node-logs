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

logs
	.deleteLogsAfterXDays(2)
	.localStorageDatabase(dirDB)
	.showInConsole(true);

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
			return logs.init();
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

/*describe("read", () =>  {

	it("should return the last writable file", () =>  {

		return logs.lastWritableFile().then((lastwritablefile) =>  {
			assert.strictEqual("string", typeof lastwritablefile, "returned value is not a string");
		});

	});

	it("should return registered log files", () =>  {

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

	});

});*/

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
