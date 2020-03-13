import { Injectable } from "@angular/core";
import { IpcRenderer } from "electron";
import { rejects } from "assert";

export interface Project {
	id: number;
	name: string;
	path: string;
}

@Injectable({
	providedIn: "root"
})
export class ConfigService {
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

	async getProjects(): Promise<Array<Object>> {
		return new Promise<Array<Object>>((resolve, reject) => {
			this.ipcRenderer.once("getConfigResponse", (event, arg) => {
				var projectsArray = Object.keys(arg).map((index) => {
					var project = arg[index];
					return project;
				});
				resolve(projectsArray);
			});
			this.ipcRenderer.send("getConfig", "$.projects");
		});
	}

	async getDefaultView(): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			this.ipcRenderer.once("getConfigResponse", (event, arg) => {
				resolve(arg);
			});
			this.ipcRenderer.send("getConfig", "$.defaultView");
		});
	}

	async getNumberOfProjects(): Promise<number> {
		return new Promise<number>((resolve, reject) => {
			this.ipcRenderer.once("runAQueryResponse", (event, arg) => {
				resolve(arg["length"]);
			});
			this.ipcRenderer.send("runAQuery", "$.projects.length");
		});
	}

	setProjectPath(projectId: number, pathToProject: string) {
		this.ipcRenderer.send("setConfig", `$.projects[${projectId}].path`, pathToProject);
	}

	setDefaultView(value: string) {
		this.ipcRenderer.send("setConfig", "$.defaultView", value);
	}

	addProject(projectName: string, projectPath: string) {
		this.getNumberOfProjects().then((result) => {
			var project = {
				name: projectName,
				path: projectPath
			};
			var numberOfProjects: number = result;

			this.ipcRenderer.send("setConfig", `$.projects[${numberOfProjects}]`, project);
		});
	}
}
