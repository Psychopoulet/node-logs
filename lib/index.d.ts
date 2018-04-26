/// <reference types="node" />
/// <reference types="sqlite3" />

declare module "node-logs" {

	import { Database } from "sqlite3";

	interface Interface {
		log: Function,
		success: Function,
		info: Function,
		warning: Function,
		error: Function
	}

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

	class Logs {

		protected _showInConsole: boolean;
		protected _deleteLogsAfterXDays: number;
		protected _localStorageDatabase: string;
		protected _localStorageObject: null|Database;
		protected _interfaces: Array<Interface>;

		constructor();

		public deleteLogsAfterXDays(days: number): Logs;
		public localStorageDatabase(database: string): Logs;
		public showInConsole(show: boolean): Logs;

		public log(text: any): Promise<void>;
		public success(text: any): Promise<void>;
			public ok(text: any): Promise<void>;
		public warning(text: any): Promise<void>;
			public warn(text: any): Promise<void>;
		public error(text: any): Promise<void>;
			public err(text: any): Promise<void>;
		public info(text: any): Promise<void>;

		public init(): Promise<void>;
		public addInterface(Interface): Promise<void>;
		public getLogs(Interface): Promise<Array<LogDate>>;
		public readLog(year: string|number, month: string|number, day: string|number): Promise<Array<Log>>;

	}

	export = Logs;

}
