"use strict";

// deps

	// locals
	const _console = require(require("path").join(__dirname, "..", "lib", "console.js"));

// tests

describe("_console", () => {

	it("should check no show in console", () => {
		return _console(false);
	});

	it("should check empty message", () => {
		return _console(true, "");
	});

	it("should check different types", () => {

		return _console(true, "test", []).then(() => {
			return _console(true, "log", [ "log" ]);
		}).then(() => {
			return _console(true, "information", [ "information" ]);
		}).then(() => {
			return _console(true, "success", [ "success" ]);
		}).then(() => {
			return _console(true, "warning", [ "warning" ]);
		}).then(() => {
			return _console(true, "error", [ "error" ]);
		});

	});

	it("should check different options", () => {

		return _console(true, "background", [ "log", "background" ]).then(() => {
			return _console(true, "bold", [ "log", "bold" ]);
		}).then(() => {
			return _console(true, "italic", [ "log", "italic" ]);
		}).then(() => {
			return _console(true, "strikethrough", [ "log", "strikethrough" ]);
		}).then(() => {
			return _console(true, "underline", [ "log", "underline" ]);
		});

	});

	it("should check different types with background", () => {

		return _console(true, "log", [ "log", "background" ]).then(() => {
			return _console(true, "information", [ "information", "background" ]);
		}).then(() => {
			return _console(true, "success", [ "success", "background" ]);
		}).then(() => {
			return _console(true, "warning", [ "warning", "background" ]);
		}).then(() => {
			return _console(true, "error", [ "error", "background" ]);
		});

	});

});
