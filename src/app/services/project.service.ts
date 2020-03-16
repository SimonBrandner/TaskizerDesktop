import { Injectable } from "@angular/core";
import { IpcRenderer } from "electron";

@Injectable({
	providedIn: "root"
})
export class ProjectService {
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

	createNewProject(projectName: string, projectPath: string): void {
		this.ipcRenderer.send("createNewProject", projectName, projectPath);
	}

	private ipcRenderer: IpcRenderer;
}
