import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { ConfigService } from "../../services/config.service";
import { DialogService } from "../../services/dialog.service";

@Component({
	selector: "app-settings",
	templateUrl: "./settings.component.html",
	styleUrls: [
		"./settings.component.css"
	]
})
export class SettingsComponent implements OnInit {
	defaultViewSelectList = [
		"Today",
		"Calender"
	];

	constructor(
		public dialogRef: MatDialogRef<SettingsComponent>,
		private configService: ConfigService,
		private dialogService: DialogService
	) {
		this.configService.getDefaultView().then((result) => {
			this.defaultViewSelect = result;
			console.log("Retrieved defaultView from ConfigService");
			this.configService.getDefaultProjectPath().then((result) => {
				this.defaultProjectPath = result;
				console.log("Retrieved defaultProjectPath from ConfigService");
			});
		});
	}

	ngOnInit(): void {}

	saveButtonClicked(): void {
		console.log("Save button clicked.");
		this.configService.setDefaultView(this.defaultViewSelect);
		console.log("Setting defaultView using ConfigService.");
		this.configService.setDefaultProjectPath(this.defaultProjectPath);
		console.log("Setting defaultProjectPath using ConfigService.");

		this.dialogRef.close();
	}

	pathButtonClicked(): void {
		console.log("Path button clicked.");
		this.dialogService.openDefaultProjectDirectoryDialog().then((result) => {
			this.defaultProjectPath = result;
			console.log("Retrieved desired default project location from user using DialogService");
		});
	}

	defaultViewSelect: string;
	defaultProjectPath: string;
}
