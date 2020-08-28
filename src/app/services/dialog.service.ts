import { Injectable, NgZone } from "@angular/core";
import { IpcRenderer } from "electron";
import { ConfigService } from "./config.service";
import { MatDialog } from "@angular/material/dialog";
import { UniversalDialogComponent } from "../components/universal-dialog/universal-dialog.component";

@Injectable({
	providedIn: "root"
})
export class DialogService {
	private ipcRenderer: IpcRenderer;

	constructor(private configService: ConfigService, public dialog: MatDialog, private zone: NgZone) {
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

		if (this.ipcRenderer) {
			this.ipcRenderer.on("projectMissingError", (event, data, projectPath) => {
				this.zone.run(() => {
					this.universalDialog(data).then((result) => {
						if (result) {
							var project = this.configService.getProjectByPath(projectPath);
							if (project) {
								this.configService.deleteProject(project["id"]);
							}
						}
					});
				});
			});
		}
	}

	universalDialog(data: {
		title: string;
		message: string;
		actions: Array<{ name: string; response: any }>;
	}): Promise<any> {
		return new Promise<any>((resolve) => {
			console.log("Opening universal dialog", data);
			const dialogRef = this.dialog.open(UniversalDialogComponent, {
				width: "400px",
				data: data
			});
			dialogRef.afterClosed().subscribe((result) => {
				console.log("Universal dialog closed", result);
				resolve(result);
			});
		});
	}

	async saveProjectDialog(): Promise<string | undefined> {
		return new Promise<string | undefined>((resolve, reject) => {
			this.ipcRenderer.once("openDialogResponse", (event, arg) => {
				if (arg.canceled == true) {
					resolve(undefined);
				}
				else {
					resolve(arg.filePaths[0]);
				}
			});
			this.ipcRenderer.send("openDialog", {
				title: "Set directory to which save the project",
				defaultPath: this.configService.getDefaultProjectPath(),
				properties: [
					"openDirectory"
				]
			});
		});
	}

	async openDefaultProjectDirectoryDialog(): Promise<string | undefined> {
		return new Promise<string | undefined>((resolve, reject) => {
			this.ipcRenderer.once("openDialogResponse", (event, arg) => {
				if (arg.canceled == true) {
					resolve(undefined);
				}
				else {
					resolve(arg.filePaths[0]);
				}
				console.log(arg);
			});
			this.ipcRenderer.send("openDialog", {
				title: "Set default project path",
				defaultPath: this.configService.getDefaultProjectPath(),
				properties: [
					"openDirectory"
				]
			});
		});
	}

	async importProjectDialog(): Promise<string | undefined> {
		return new Promise<string | undefined>((resolve, reject) => {
			this.ipcRenderer.once("openDialogResponse", (event, arg) => {
				if (arg.canceled == true) {
					resolve(undefined);
				}
				else {
					resolve(arg.filePaths[0]);
				}
			});
			this.ipcRenderer.send("openDialog", {
				title: "Set default project path",
				defaultPath: this.configService.getDefaultProjectPath(),
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
	}
}
