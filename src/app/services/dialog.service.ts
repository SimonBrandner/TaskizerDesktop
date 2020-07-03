import { Injectable } from "@angular/core";
import { IpcRenderer } from "electron";
import { ConfigService } from "./config.service";

@Injectable({
	providedIn: "root"
})
export class DialogService {
	private ipcRenderer: IpcRenderer;

	constructor(private configService: ConfigService) {
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

	async saveProjectDialog(): Promise<string | undefined> {
		return new Promise<string | undefined>((resolve, reject) => {
			this.configService.getDefaultProjectPath().then((result) => {
				this.ipcRenderer.once("openDialogSyncResponse", (event, arg) => {
					resolve(arg);
				});
				this.ipcRenderer.send("openDialogSync", {
					title: "Set directory to which save the project",
					defaultPath: result,
					properties: [
						"openDirectory"
					]
				});
			});
		});
	}

	async openDefaultProjectDirectoryDialog(): Promise<string | undefined> {
		return new Promise<string | undefined>((resolve, reject) => {
			this.configService.getDefaultProjectPath().then((result) => {
				this.ipcRenderer.once("openDialogSyncResponse", (event, arg) => {
					resolve(arg);
				});
				this.ipcRenderer.send("openDialogSync", {
					title: "Set default project path",
					defaultPath: result,
					properties: [
						"openDirectory"
					]
				});
			});
		});
	}

	async importProjectDialog(): Promise<string | undefined> {
		return new Promise<string | undefined>((resolve, reject) => {
			this.configService.getDefaultProjectPath().then((result) => {
				this.ipcRenderer.once("openDialogSyncResponse", (event, arg) => {
					resolve(arg);
				});
				this.ipcRenderer.send("openDialogSync", {
					title: "Set default project path",
					defaultPath: result,
					filters: [
						{
							name: "Taskizer project",
							extensions: [
								"taskizer"
							]
						}
					]
				});
			});
		});
	}
}
