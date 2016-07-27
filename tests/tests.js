"use strict";

// deps

	const	path = require("path"),
			assert = require("assert"),

			fs = require("node-promfs"),

			SimpleLogs = require(path.join(__dirname, "..", "lib", "main.js"));

// private

	var date = new Date(),
		sYear = date.getFullYear() + "",
		sMonth = (9 < sMonth) ? sMonth + "" : "0" + sMonth,
		sDay = (9 < sDay) ? sDay + "" : "0" + sDay,

		sDir = path.join(__dirname, "logs"),
		sFile = path.join(sDir, sYear + "_" + sMonth + "_" + sDay + ".html"),

		Logs = new SimpleLogs(sDir);

describe("errors", function() {

	before(function(done) {
		fs.rmdirpProm(Logs.pathDirLogs).then(done).catch(done);
	});

	it("should check pathDirLogs type value", function() {
		assert.throws(function() { Logs.pathDirLogs = 15; }, Error, "check type value does not throw an error");
		assert.doesNotThrow(function() { Logs.pathDirLogs = sDir; }, Error, "check type value throw an error");
	});

});

describe("write", function() {

	describe("log", function() {

		it("should test function", function() {

			return Logs.log("log").then(function() {
				return Logs.log({ test: "test" });
			}).then(function() {
				return Logs.log([ "01", "02", "03" ]);
			});

		});

	});

	describe("info", function() {

		it("should test function", function() {

			return Logs.info("info");

		});

	});

	describe("success", function() {

		it("should test function", function() {

			return Logs.ok("ok").then(function() {
				return Logs.success("success");
			});

		});

	});

	describe("warning", function() {

		it("should test function", function() {

			return Logs.warn("warn").then(function() {
				return Logs.warning("warning");
			});

		});

	});

	describe("error", function() {

		it("should test function", function() {

			return Logs.err("err").then(function() {
				return Logs.error("error");
			});

		});

	});

});

describe("read", function() {

	it("should return registered log files", function() {

		return Logs.getLogs().then(function(logs) {
			assert.strictEqual(true, logs instanceof Object, "returned value is not an Array");
			return Logs.read(sYear, sMonth, sDay);
		}).then(function(txt) {
			assert.strictEqual("string", typeof txt, "returned value is not a string");
		});

	});

});

describe("delete", function() {

	after(function(done) {
		fs.rmdirpProm(sDir).then(done).catch(done);
	});

	it("should delete log file", function() {

		return Logs.remove(sYear, sMonth, sDay).then(function() {

			assert.strictEqual(false, fs.isFileSync(sFile), "log file was not deleted");

		});

	});

});
