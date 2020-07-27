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

	setProjectContent(path: string, content: any) {
		console.log("Setting project content to ", content, ". The path is: ", path);
		this.getProjectByPath(path).then((result) => {
			result["tasks"] = content;
			this.ipcRenderer.send("setProject", path, result);
		});
	}

	createNewProject(name: string, path: string): void {
		console.log("Handling new project ", name, " with path ", path);
		this.ipcRenderer.send("handleNewProject", name, path);
	}

	editProject(oldProject, newProject): void {
		if (oldProject.path != newProject.path) {
			this.moveProject(oldProject.path, newProject.path);
		}

		if (oldProject.name != newProject.name) {
			this.changeProjectName(newProject.path, newProject.name);
		}
	}

	moveProject(oldPath: string, newPath: string): void {
		console.log("Moving project from ", oldPath, " to ", newPath);
		this.ipcRenderer.send("moveProjectFile", oldPath, newPath);
	}

	changeProjectName(path: string, name: string): void {
		console.log("Changing project name to ", name, ". The path is: ", path);
		this.getProjectByPath(path).then((result) => {
			result["name"] = name;
			this.ipcRenderer.send("setProject", path, result);
		});
	}

	deleteProject(projectPath: string): void {
		console.log("Deleting project with path ", projectPath);
		this.ipcRenderer.send("deleteProjectFile", projectPath);
	}

	async getProjectByPath(projectPath: string): Promise<any> {
		return new Promise<any>((resolve) => {
			this.ipcRenderer.once("getProjectResponse", (event, arg) => {
				console.log("Retrieved project from Electron with path ", projectPath, ": ", arg);
				resolve(arg);
			});
			this.ipcRenderer.send("getProject", projectPath);
		});
	}

	private ipcRenderer: IpcRenderer;
}
