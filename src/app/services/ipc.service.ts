import { Injectable } from "@angular/core";
import { IpcRenderer } from "electron";

@Injectable({
	providedIn: "root"
})
export class IpcService {
	private ipcRenderer: IpcRenderer;

	constructor() {
		if ((<any>window).require) {
			try {
				this.ipcRenderer = (<any>window).require("electron").ipcRenderer;
			} catch (error) {
				throw error;
			}
		}
		else {
			console.warn("Could not load electron ipc");
		}

		if (this.ipcRenderer) {
			console.log("FKJSHFKJHDFKJSHFKJSFKJ");
			this.ipcRenderer.on("isAngularRunning", () => {
				console.log("Electron is checking if Angular is running. Sending response.");
				this.ipcRenderer.send("isAngularRunningResponse");
			});
		}
	}
}
