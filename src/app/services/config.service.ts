import { Injectable } from "@angular/core";
import { IpcRenderer } from "electron";
import { rejects } from "assert";
import { AlgorithmsService } from "./algorithms.service";

export interface Project {
	id: number;
	name: string;
	path: string;
}

@Injectable({
	providedIn: "root"
})
export class ConfigService {
	constructor(private algorithmsService: AlgorithmsService) {
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

	async getDefaultProjectPath(): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			this.ipcRenderer.once("getConfigResponse", (event, arg) => {
				resolve(arg);
			});
			this.ipcRenderer.send("getConfig", "$.defaultProjectPath");
		});
	}

	async getIdForNewProject(): Promise<number> {
		return new Promise<number>((resolve, reject) => {
			this.ipcRenderer.once("runAQueryResponse", (event, arg) => {
				resolve(this.algorithmsService.findLowestUnusedValueInNumberArray(arg));
			});
			this.ipcRenderer.send("runAQuery", "$.projects..id");
		});
	}

	async getNumberOfProjects(): Promise<number> {
		return new Promise<number>((resolve, reject) => {
			this.ipcRenderer.once("runAQueryResponse", (event, arg) => {
				resolve(arg);
			});
			this.ipcRenderer.send("runAQuery", "$.projects.length");
		});
	}

	async getProjectById(projectId: number) {
		return new Promise<Object>((resolve, reject) => {
			this.ipcRenderer.once("runAQueryResponse", (event, arg) => {
				resolve(arg[0]);
			});
			this.ipcRenderer.send("runAQuery", `$.projects[${projectId}]`);
		});
	}

	setProjectPath(projectId: number, projectPath: string) {
		this.ipcRenderer.send("setConfig", `$.projects[${projectId}].path`, projectPath);
	}

	setProjectName(projectId: number, projectName: string) {
		this.ipcRenderer.send("setConfig", `$.projects[${projectId}].name`, projectName);
	}

	setDefaultView(value: string) {
		this.ipcRenderer.send("setConfig", "$.defaultView", value);
	}

	addProject(projectName: string, projectPath: string) {
		this.getIdForNewProject().then((idForNewProject) => {
			this.getNumberOfProjects().then((numberOfProjects) => {
				this.ipcRenderer.send("setConfig", `$.projects[${numberOfProjects}]`, {
					id: idForNewProject,
					name: projectName,
					path: projectPath
				});
			});
		});
	}

	editProject(project): void {
		this.ipcRenderer.send("setConfig", `$.projects[?(@.id==${project.id})]`, project);
	}

	private ipcRenderer: IpcRenderer;
}
