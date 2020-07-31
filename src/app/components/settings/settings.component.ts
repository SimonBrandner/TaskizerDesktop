import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { ConfigService } from "../../services/config.service";
import { DialogService } from "../../services/dialog.service";
import { ThemeService } from "../../services/theme.service";

@Component({
	selector: "settings",
	templateUrl: "./settings.component.html",
	styleUrls: [
		"./settings.component.scss"
	]
})
export class SettingsComponent implements OnInit {
	constructor(
		public dialogRef: MatDialogRef<SettingsComponent>,
		private configService: ConfigService,
		private dialogService: DialogService,
		public themeService: ThemeService
	) {}

	ngOnInit(): void {
		this.defaultView = this.configService.getDefaultView();
		console.log("Retrieved config from ConfigService", this.defaultView);
		this.defaultProjectPath = this.configService.getDefaultProjectPath();
		console.log("Retrieved config from ConfigService", this.defaultProjectPath);
		this.currentTheme = this.configService.getTheme();
		console.log("Retrieved config from ConfigService", this.currentTheme);
	}

	saveButtonClicked(): void {
		console.log("Save button clicked.");
		this.configService.setDefaultView(this.defaultView);
		console.log("Setting defaultView using ConfigService.");
		this.configService.setDefaultProjectPath(this.defaultProjectPath);
		console.log("Setting defaultProjectPath using ConfigService.");
		this.configService.setTheme(this.currentTheme);
		console.log("Setting theme using ConfigService.");

		this.dialogRef.close();
	}

	pathButtonClicked(): void {
		console.log("Path button clicked.");
		this.dialogService.openDefaultProjectDirectoryDialog().then((result) => {
			if (result != undefined) {
				this.defaultProjectPath = result;
				console.log("Retrieved desired default project location from user using DialogService");
			}
			else {
				console.log("DialogService returned undefined");
			}
		});
	}

	themeChanged() {
		this.themeService.set(this.currentTheme);
	}

	defaultView: string;
	defaultProjectPath: string;
	currentTheme: any;

	views = [
		"Today"
	];
}
