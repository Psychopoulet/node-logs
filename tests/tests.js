"use strict";

// deps

	const	path = require("path"),
			assert = require("assert"),

			fs = require("node-promfs"),

			NodeLogs = require(path.join(__dirname, "..", "dist", "main.js"));

// private

	var sDir = path.join(__dirname, "logs"),
		Logs = new NodeLogs(sDir),

		date = new Date(),
		sYear = date.getFullYear() + "",
		sMonth = (9 < date.getMonth() + 1) ? date.getMonth() + 1 + "" : "0" + (date.getMonth() + 1),
		sDay = (9 < date.getDate()) ? date.getDate() + "" : "0" + date.getDate();

describe("errors", () => {

	after(() => { return fs.rmdirpProm(sDir); });

	it("should check pathDirLogs type value", () => {
		assert.throws(() => { Logs.pathDirLogs = 15; }, Error, "check type value does not throw an error");
		assert.doesNotThrow(() => { Logs.pathDirLogs = sDir; }, Error, "check type value throw an error");
	});

});

describe("write", () => {

	before(() => { return fs.rmdirpProm(sDir); });

	it("should test log function", () => {

		return Logs.log("log").then(() => {
			return Logs.log({ test: "test" });
		}).then(() => {
			return Logs.log([ "01", "02", "03" ]);
		});

	});

	it("should test info function", () => {

		return Logs.info("info");

	});

	it("should test success function", () => {

		return Logs.ok("ok").then(() => {
			return Logs.success("success");
		});

	});

	it("should test warning function", () => {

		return Logs.warn("warn").then(() => {
			return Logs.warning("warning");
		});

	});

	it("should test error function", () => {

		return Logs.err("err").then(() => {
			return Logs.error("error");
		});

	});

});

describe("read", () =>  {

	it("should return the last writable file", () =>  {

		return Logs.lastWritableFile().then((lastwritablefile) =>  {
			assert.strictEqual("string", typeof lastwritablefile, "returned value is not a string");
		});

	});

	it("should return registered log files", () =>  {

		return Logs.getLogs().then((logs) =>  {

			assert.strictEqual(true, logs instanceof Object, "returned value is not an Object");
			assert.strictEqual(true, logs[sYear] && logs[sYear] instanceof Object, "returned value is not an Object with year");
			assert.strictEqual(true, logs[sYear][sMonth] && logs[sYear][sMonth] instanceof Object, "returned value is not an Object with month");
			assert.strictEqual(true, logs[sYear][sMonth][sDay] && logs[sYear][sMonth][sDay] instanceof Object, "returned value is not an Object with day");

			return Logs.read(sYear, sMonth, sDay, 1);

		}).then((txt) =>  {

			assert.strictEqual("string", typeof txt, "returned value is not a string");
			assert.strictEqual("<table class=\"node-logs\">", txt.substring(0, "<table class=\"node-logs\">".length), "returned value is not correctely formated");
			assert.strictEqual("</table>", txt.substring(txt.length - "</table>".length, txt.length), "returned value is not correctely formated");

		});

	});

});

describe("delete", () =>  {

	after(() => { return fs.rmdirpProm(sDir); });

	it("should delete logs for an entiere day", () =>  {
		return Logs.removeDay(sYear, sMonth, sDay);
	});

});
