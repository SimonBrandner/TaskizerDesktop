import { Injectable } from "@angular/core";
import { IpcRenderer } from "electron";
import { Subject } from "rxjs";

@Injectable({
	providedIn: "root"
})
export class NotificationService {
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
			this.ipcRenderer.on("focusOnTask", (event, arg) => {
				this.focusOnTaskEvent.next(arg);
			});
		}
	}

	focusOnTaskEvent: Subject<{
		projectId: number;
		taskId: number;
	}> = new Subject<{
		projectId: number;
		taskId: number;
	}>();

	private ipcRenderer: IpcRenderer;
}
