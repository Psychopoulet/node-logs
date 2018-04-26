/// <reference path="../../lib/index.d.ts" />

import Logs = require("../../lib/main.js");
import { join } from "path";
import { request, IncomingMessage } from "http";

interface LogDate {
  year: string,
  month: string,
  day: string
}

interface Log {
	date: string,
	time: string,
	type: string,
	message: string
}

const logger = new Logs();

logger
	.deleteLogsAfterXDays(2)
	.localStorageDatabase(join(__dirname, "logs.db"))
	.showInConsole(false);

function _myOwnLogger(type: string, msg: string) {

	const req = request({
		"host": "www.myownloger.com",
		"method": "PUT",
		"path": "/api/" + type + "/"
	}, (res: IncomingMessage) => {

		res.setEncoding("utf8");

		let data = "";
		res.on("data", (chunk: string) => {
			data += chunk;
		}).on("end", () => {
			console.log(data);
		});

	});

	req.write(msg);
	req.end();

}

logger.addInterface({

	"log" : (msg: string) => {
		_myOwnLogger("log", msg);
	},
	"success" : (msg: string) => {
		_myOwnLogger("success", msg);
	},
	"info" : (msg: string) => {
		_myOwnLogger("info", msg);
	},
	"warning" : (msg: string) => {
		_myOwnLogger("warning", msg);
	},
	"error" : (msg: string) => {
		_myOwnLogger("error", msg);
	}

}).then(() => {

	return logger.init();

}).then(() => {

	return logger.log("log").then(() => {

		return logger.ok("ok").then(() => {
			return logger.success("success");
		});

	}).then(() => {

		return logger.warn("warn").then(() => {
			return logger.warning("warning");
		});

	}).then(() => {

		return logger.err("err").then(() => {
			return logger.error("error");
		});

	}).then(() => {
		return logger.info("info");
	});

}).then(() => {

	return logger.getLogs().then((logs: Array<LogDate>) => {
		return logger.readLog(logs[0].year, logs[0].month, logs[0].day);
	}).then((logs: Array<Log>) => {
		console.log(logs);
	});

}).then(() => {

	return logger.release();

}).catch((err: Error) => {
	console.error(err);
});