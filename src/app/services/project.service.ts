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

	getFolderPathFromFullPath(fullPath: string) {
		return fullPath.split("/").slice(0, -1).join("/");
	}

	getNameFromFullPath(fullPath: string) {
		return fullPath.split("/")[fullPath.split("/").length - 1].split(".")[0];
	}

	setProjectContent(projectPath: string, project) {
		this.ipcRenderer.send("setProject", projectPath, "$.tasks", project);
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

	async getProjectByPath(projectPath: string) {
		return new Promise<Object>((resolve) => {
			this.ipcRenderer.once("getProjectResponse", (event, arg) => {
				resolve(arg);
			});
			this.ipcRenderer.send("getProject", projectPath);
		});
	}

	private ipcRenderer: IpcRenderer;
}
