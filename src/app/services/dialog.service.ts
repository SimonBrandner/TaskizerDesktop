import { Injectable } from "@angular/core";
import { IpcRenderer } from "electron";

@Injectable({
	providedIn: "root"
})
export class DialogService {
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
	}

	async saveDialogSync(): Promise<string | undefined> {
		return new Promise<string | undefined>((resolve, reject) => {
			this.ipcRenderer.once("saveDialogSyncResponse", (event, arg) => {
				resolve(arg);
				console.log(arg);
			});
			this.ipcRenderer.send("saveDialogSync");
		});
	}
}
