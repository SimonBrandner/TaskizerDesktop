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

	editProject(oldProject, newProject): void {
		if (oldProject.path != newProject.path) {
			this.moveProject(newProject.id, oldProject.path, newProject.path);
		}

		if (oldProject.name != newProject.name) {
			this.changeProjectName(newProject.id, newProject.path, newProject.name);
		}
	}

	moveProject(id: number, oldPath: string, newPath: string): void {
		this.ipcRenderer.send("copyProjectFile", oldPath, newPath);
	}

	changeProjectName(id: number, path: string, name: string): void {
		this.ipcRenderer.send("setProject", path, "$.name", name);
	}

	deleteProject(projectPath: string): void {
		this.ipcRenderer.send("deleteProjectFile", projectPath);
	}

	private ipcRenderer: IpcRenderer;
}
