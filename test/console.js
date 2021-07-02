"use strict";

// deps

	// locals
	const consoleLogger = require(require("path").join(__dirname, "..", "lib", "consoleLogger.js"));

// tests

describe("consoleLogger", () => {

	it("should check empty message", () => {
		return consoleLogger("");
	});

	it("should check different types", () => {

		consoleLogger("test", []);
		consoleLogger("log", [ "log" ]);
		consoleLogger("information", [ "information" ]);
		consoleLogger("success", [ "success" ]);
		consoleLogger("warning", [ "warning" ]);
		consoleLogger("error", [ "error" ]);

	});

	it("should check dupplicates options types", () => {

		consoleLogger("test", []);
		consoleLogger("log", [ "log", "log" ]);
		consoleLogger("information", [ "information", "information" ]);
		consoleLogger("success", [ "success", "success" ]);
		consoleLogger("warning", [ "warning", "warning" ]);
		consoleLogger("error", [ "error", "error" ]);

	});

	it("should check different options", () => {

		consoleLogger("background", [ "log", "background" ]);
		consoleLogger("bold", [ "log", "bold" ]);
		consoleLogger("italic", [ "log", "italic" ]);
		consoleLogger("strikethrough", [ "log", "strikethrough" ]);
		consoleLogger("underline", [ "log", "underline" ]);

	});

	it("should check different types with background", () => {

		consoleLogger("log", [ "log", "background" ]);
		consoleLogger("information", [ "information", "background" ]);
		consoleLogger("success", [ "success", "background" ]);
		consoleLogger("warning", [ "warning", "background" ]);
		consoleLogger("error", [ "error", "background" ]);

	});

});
