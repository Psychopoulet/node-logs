"use strict";

// deps

	// locals
	const _console = require(require("path").join(__dirname, "..", "lib", "console.js"));

// tests

describe("_console", () => {

	it("should check empty message", () => {
		return _console("");
	});

	it("should check different types", () => {

		return _console("test", []).then(() => {
			return _console("log", [ "log" ]);
		}).then(() => {
			return _console("information", [ "information" ]);
		}).then(() => {
			return _console("success", [ "success" ]);
		}).then(() => {
			return _console("warning", [ "warning" ]);
		}).then(() => {
			return _console("error", [ "error" ]);
		});

	});

	it("should check dupplicates options types", () => {

		return _console("test", []).then(() => {
			return _console("log", [ "log", "log" ]);
		}).then(() => {
			return _console("information", [ "information", "information" ]);
		}).then(() => {
			return _console("success", [ "success", "success" ]);
		}).then(() => {
			return _console("warning", [ "warning", "warning" ]);
		}).then(() => {
			return _console("error", [ "error", "error" ]);
		});

	});

	it("should check different options", () => {

		return _console("background", [ "log", "background" ]).then(() => {
			return _console("bold", [ "log", "bold" ]);
		}).then(() => {
			return _console("italic", [ "log", "italic" ]);
		}).then(() => {
			return _console("strikethrough", [ "log", "strikethrough" ]);
		}).then(() => {
			return _console("underline", [ "log", "underline" ]);
		});

	});

	it("should check different types with background", () => {

		return _console("log", [ "log", "background" ]).then(() => {
			return _console("information", [ "information", "background" ]);
		}).then(() => {
			return _console("success", [ "success", "background" ]);
		}).then(() => {
			return _console("warning", [ "warning", "background" ]);
		}).then(() => {
			return _console("error", [ "error", "background" ]);
		});

	});

});
