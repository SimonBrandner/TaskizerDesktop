import { Injectable, NgZone } from "@angular/core";
import { IpcRenderer } from "electron";
import { ConfigService } from "./config.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ErrorComponent } from "../components/error/error.component";

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
			this.ipcRenderer.on("error", (event, errorTitle, errorMessage) => {
				this.zone.run(() => {
					this.errorDialog(errorTitle, errorMessage);
				});
			});
		}
	}

	errorDialog(errorTitle: string, errorMessage: string): void {
		var data = { title: errorTitle, message: errorMessage };
		console.log("Opening error dialog", data);
		this.dialog.open(ErrorComponent, {
			width: "400px",
			data: data
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
