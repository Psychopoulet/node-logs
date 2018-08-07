/// <reference types="node" />
/// <reference types="sqlite3" />

declare module "node-logs" {

	import { Database } from "sqlite3";

	type iOption = "background" | "bold" | "italic" | "underline";

	interface iInterface {
		log: Function;
		success: Function;
		information: Function;
		warning: Function;
		error: Function;
	}

	interface iLogDate {
		year: string;
		month: string;
		day: string;
	}

	interface iLog {
		date: string;
		time: string;
		type: string;
		message: string;
	}

	class Logs {

		protected _showInConsole: boolean;
		protected _deleteLogsAfterXDays: number;
		protected _localStorageDatabase: string;
		protected _localStorageObject: null|Database;
		protected _interfaces: Array<iInterface>;

		constructor();

		public deleteLogsAfterXDays(days: number): Logs;
		public localStorageDatabase(database: string): Logs;
		public showInConsole(show: boolean): Logs;

		public log(text: any, option?: Array<iOption>): Promise<void>;
		public success(text: any, option?: Array<iOption>): Promise<void>;
			public ok(text: any, option?: Array<iOption>): Promise<void>;
		public warning(text: any, option?: Array<iOption>): Promise<void>;
			public warn(text: any, option?: Array<iOption>): Promise<void>;
		public error(text: any, option?: Array<iOption>): Promise<void>;
			public err(text: any, option?: Array<iOption>): Promise<void>;
		public information(text: any, option?: Array<iOption>): Promise<void>;
			public info(text: any, option?: Array<iOption>): Promise<void>;

		public init(): Promise<void>;
		public addInterface(iInterface): Promise<void>;
		public getLogs(iInterface): Promise<Array<iLogDate>>;
		public readLog(year: string|number, month: string|number, day: string|number): Promise<Array<iLog>>;

	}

	export = Logs;

}
