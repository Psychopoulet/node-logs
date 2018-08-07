/// <reference types="node" />

declare module "node-logs" {

	type iOption = "background" | "bold" | "italic" | "strikethrough" | "underline";

	interface iInterface {
		log: Function;
		success: Function;
		information: Function;
		warning: Function;
		error: Function;
	}

	class Logs {

		protected _showInConsole: boolean;
		protected _interfaces: Array<iInterface>;

		constructor();

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
		public addInterface(interface: iInterface): Promise<void>;

	}

	export = Logs;

}
