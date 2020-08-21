import { Injectable } from "@angular/core";
import { IpcRenderer } from "electron";
import { Algorithms } from "../classes/algorithms";

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

	getProjects(): Array<Object> {
		return this.config["projects"];
	}

	getProjectPaths(): Array<string> {
		var projectPaths: Array<string> = [];
		this.config["projects"].forEach((project) => {
			projectPaths.push(project["path"]);
		});
		return projectPaths;
	}

	getDefaultView(): string {
		return this.config["defaultView"];
	}

	getTheme(): string {
		return this.config["theme"];
	}

	getAllowPreRelease(): boolean {
		return this.config["allowPreRelease"];
	}

	getDefaultProjectPath(): string {
		return this.config["defaultProjectPath"];
	}

	getNumberOfProjects(): number {
		return this.config["projects"].length;
	}

	getProjectById(projectId: number): any {
		return this.config["projects"][projectId];
	}

	getIdForNewProject(): number {
		var ids: Array<number> = [];
		for (let project of this.config["projects"]) {
			ids.push(project.id);
		}
		return Algorithms.findLowestUnusedValueInNumberArray(ids);
	}

	addProject(projectName: string, projectPath: string) {
		this.config["projects"][this.getNumberOfProjects()] = {
			id: this.getIdForNewProject(),
			name: projectName,
			path: projectPath
		};
		this.save();
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

	setAllowPrerelease(setAllowPrerelease: boolean): void {
		this.config["allowPreRelease"] = setAllowPrerelease;
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

	async load(): Promise<void> {
		return new Promise<void>((resolve) => {
			this.ipcRenderer.once("getConfigResponse", (event, arg) => {
				this.config = arg;
				console.log("Retrieved config from Electron:", this.config);
				resolve();
			});
			this.ipcRenderer.send("getConfig");
		});
	}

	save() {
		console.log("Saving config:", this.config);
		this.ipcRenderer.send("setConfig", this.config);
	}

	private ipcRenderer: IpcRenderer;
	private config: any;
}
