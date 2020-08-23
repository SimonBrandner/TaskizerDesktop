import { Directive } from "@angular/core";
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors } from "@angular/forms";
import { Observable, of } from "rxjs";
import { IpcRenderer } from "electron";

@Directive({
	selector: "[fileValidatorDirective]",
	providers: [
		{
			provide: NG_ASYNC_VALIDATORS,
			useExisting: FileValidatorDirective,
			multi: true
		}
	]
})
export class FileValidatorDirective implements AsyncValidator {
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

	async validate(control: AbstractControl): Promise<ValidationErrors | null> {
		if (control.value == null) {
			return null;
		}

		return await this.doesFileExist(control.value).then((result) => {
			if (!result) {
				return { fileDoesNotExist: true };
			}
			else {
				return null;
			}
		});
	}

	async doesFileExist(filePath: string): Promise<boolean> {
		return new Promise<any>((resolve) => {
			this.ipcRenderer.once("doesFileExistResponse", (event, arg) => {
				console.log("Checked if file with path", filePath, "exists", arg);
				resolve(arg);
			});
			this.ipcRenderer.send("doesFileExist", filePath);
		});
	}

	private ipcRenderer: IpcRenderer;
}
