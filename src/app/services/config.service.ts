import { Injectable } from "@angular/core";
import { IpcRenderer } from "electron";

export interface Project {
	id: number;
	name: string;
	path: string;
}

@Injectable({
	providedIn: "root"
})
export class ConfigService {
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
				var indexUpper: number = 0;
				var index: number = 0;

				upperLoop: for (let projectIdUpper of arg) {
					console.log("Upper loop run num.: ", indexUpper);
					if (indexUpper != projectIdUpper) {
						for (let projectId of arg) {
							console.log("Inner loop num.: ", index);
							if (projectId == indexUpper) {
								index = 0;
								break;
							}
							if (index == arg.length - 1) {
								resolve(indexUpper);
								break upperLoop;
							}
							index++;
						}
					}
					indexUpper++;
				}
				resolve(arg.length);
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

	setProjectPath(projectId: number, pathToProject: string) {
		this.ipcRenderer.send("setConfig", `$.projects[${projectId}].path`, pathToProject);
	}

	setDefaultView(value: string) {
		this.ipcRenderer.send("setConfig", "$.defaultView", value);
	}

	addProject(projectName: string, projectPath: string) {
		console.log("test");
		this.getIdForNewProject().then((idForNewProject) => {
			this.getNumberOfProjects().then((numberOfProjects) => {
				console.log(idForNewProject);
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
