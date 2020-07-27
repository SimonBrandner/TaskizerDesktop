import { Injectable } from "@angular/core";
import { IpcRenderer } from "electron";
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

	async get(): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			this.load().then(() => {
				resolve(this.config);
			});
		});
	}

	async getProjects(): Promise<Array<Object>> {
		return new Promise<Array<Object>>((resolve, reject) => {
			this.load().then(() => {
				var projectsArray = Object.keys(this.config).map((index) => {
					var project = this.config[index];
					return project;
				});
				resolve(projectsArray);
			});
		});
	}

	async getDefaultView(): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			this.load().then(() => {
				resolve(this.config["defaultView"]);
			});
		});
	}

	async getTheme(): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			this.load().then(() => {
				resolve(this.config["theme"]);
			});
		});
	}

	async getDefaultProjectPath(): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			this.load().then(() => {
				resolve(this.config["defaultProjectPath"]);
			});
		});
	}

	async getNumberOfProjects(): Promise<number> {
		return new Promise<number>((resolve, reject) => {
			this.load().then(() => {
				resolve(this.config["projects"].length);
			});
		});
	}

	async getProjectById(projectId: number) {
		return new Promise<Object>((resolve, reject) => {
			this.load().then(() => {
				resolve(this.config["projects"][projectId]);
			});
		});
	}

	async getIdForNewProject(): Promise<number> {
		return new Promise<number>((resolve, reject) => {
			this.load().then(() => {
				var ids: Array<number> = [];
				for (let project of this.config["projects"]) {
					ids.push(project.id);
				}
				resolve(this.algorithmsService.findLowestUnusedValueInNumberArray(ids));
			});
		});
	}

	addProject(projectName: string, projectPath: string) {
		this.getIdForNewProject().then((idForNewProject) => {
			this.getNumberOfProjects().then((numberOfProjects) => {
				this.config["projects"][numberOfProjects] = {
					id: idForNewProject,
					name: projectName,
					path: projectPath
				};
				this.save();
			});
		});
	}

	setProjectPath(projectId: number, projectPath: string) {
		this.config["projects"][projectId]["path"] = projectPath;
		this.save();
	}

	setProjectName(projectId: number, projectName: string) {
		this.config["projects"][projectId]["name"] = projectName;
		this.save();
	}

	setDefaultView(defaultView: string) {
		this.config["defaultView"] = defaultView;
		this.save();
	}

	setTheme(theme: string): void {
		this.config["theme"] = theme;
		this.save();
	}

	setDefaultProjectPath(path: string): void {
		this.config["defaultProjectPath"] = path;
		this.save();
	}

	setProject(project): void {
		this.config["projects"][project.id] = project;
		this.save();
	}

	deleteProject(projectId: number): void {
		this.config["projects"].splice(projectId, 1);
		this.save();
	}

	setProjects(projects: Array<any>): void {
		this.config["projects"] = projects;
		this.save();
	}

	private async load(): Promise<void> {
		return new Promise<void>((resolve) => {
			this.ipcRenderer.once("getConfigResponse", (event, arg) => {
				this.config = arg;
				console.log("Retrieved config from Electron: ", this.config);
				resolve();
			});
			this.ipcRenderer.send("getConfig");
		});
	}

	private save() {
		console.log("Saving config: ", this.config);
		this.ipcRenderer.send("setConfig", this.config);
	}

	private ipcRenderer: IpcRenderer;
	config: any;
}
