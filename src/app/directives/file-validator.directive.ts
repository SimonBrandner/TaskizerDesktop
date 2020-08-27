import { Directive } from "@angular/core";
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors } from "@angular/forms";
import { IpcRenderer } from "electron";
import { IpcService } from "../services/ipc.service";

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
	constructor(_ipcService: IpcService) {
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

		this.ipcService = _ipcService;
	}

	async validate(control: AbstractControl): Promise<ValidationErrors | null> {
		if (control.value == null) {
			return null;
		}

		return await this.ipcService.doesFileExist(control.value).then((result) => {
			if (!result) {
				return { fileDoesNotExist: true };
			}
			else {
				return null;
			}
		});
	}

	private ipcService: IpcService;
	private ipcRenderer: IpcRenderer;
}
