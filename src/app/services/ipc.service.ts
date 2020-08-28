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
			console.log("Sending info to Electron that Angular is running.");
			this.ipcRenderer.send("angularRunning");
		}
	}

	async doesFileExist(filePath: string): Promise<boolean> {
		return new Promise<any>((resolve) => {
			this.ipcRenderer.once("doesFileExistResponse", (event, payload) => {
				console.log("Checked if file with path", filePath, "exists", payload);
				resolve(payload);
			});
			this.ipcRenderer.send("doesFileExist", filePath);
		});
	}
}
