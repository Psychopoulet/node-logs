"use strict";

// deps

	const _console = require(require("path").join(__dirname, "..", "lib", "console.js"));

describe("_console", () => {

	it("should check no show in console", () => {
		return _console(false);
	});

	it("should check empty message", () => {
		return _console(true, "log", "");
	});

	it("should check different types", () => {

		return _console(true, "log", "test").then(() => {
			return _console(true, "information", "test");
		}).then(() => {
			return _console(true, "success", "test");
		}).then(() => {
			return _console(true, "warning", "test");
		}).then(() => {
			return _console(true, "error", "test");
		});

	});

	it("should check background options", () => {
		return _console(true, "log", "test", [ "background" ]);
	});

	it("should check bold options", () => {
		return _console(true, "log", "test", [ "bold" ]);
	});

	it("should check italic options", () => {
		return _console(true, "log", "test", [ "italic" ]);
	});

	it("should check underline options", () => {
		return _console(true, "log", "test", [ "underline" ]);
	});

});
