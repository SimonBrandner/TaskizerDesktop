import { Injectable } from "@angular/core";
import { IpcRenderer, IpcRendererEvent } from "electron";
import { Subject } from "rxjs";

@Injectable({
	providedIn: "root"
})
export class MenuService {
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
			this.ipcRenderer.on("newProject", () => {
				this.newProjectEvent.next();
			});
			this.ipcRenderer.on("importProject", () => {
				this.importProjectEvent.next();
			});
			this.ipcRenderer.on("newTask", () => {
				this.newTaskEvent.next();
			});
			this.ipcRenderer.on("nextNavItem", () => {
				this.nextNavItemEvent.next();
			});
			this.ipcRenderer.on("previousNavItem", () => {
				this.previousNavItemEvent.next();
			});
		}
	}

	newProjectEvent: Subject<void> = new Subject<void>();
	importProjectEvent: Subject<void> = new Subject<void>();
	newTaskEvent: Subject<void> = new Subject<void>();
	nextNavItemEvent: Subject<void> = new Subject<void>();
	previousNavItemEvent: Subject<void> = new Subject<void>();

	private ipcRenderer: IpcRenderer;
}
