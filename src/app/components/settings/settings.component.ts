import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { ConfigService } from "../../services/config.service";

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

	constructor(public dialogRef: MatDialogRef<SettingsComponent>, private configService: ConfigService) {
		this.configService.getDefaultView().then((result) => {
			this.defaultViewSelect = result;
		});
	}

	ngOnInit(): void {}

	saveButtonClicked(): void {
		this.configService.setDefaultView(this.defaultViewSelect);

		this.dialogRef.close();
	}

	defaultViewSelect: string;
}
