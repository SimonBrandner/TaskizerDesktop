import { Injectable } from "@angular/core";
import { IpcRenderer } from "electron";
import { rejects } from "assert";
import { resolve } from "dns";

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

	async getProjects() {
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

	async setProjectPath(projectId: number, pathToProject: string) {
		this.ipcRenderer.send("setConfig", `$.projects[${projectId}].path`, pathToProject);
	}

	async setDefaultView(value: string) {
		this.ipcRenderer.send("setConfig", "$.defaultView", value);
	}

	async getDefaultView() {
		return new Promise<string>((resolve, reject) => {
			this.ipcRenderer.once("getConfigResponse", (event, arg) => {
				resolve(arg);
			});
			this.ipcRenderer.send("getConfig", "$.defaultView");
		});
	}
}
