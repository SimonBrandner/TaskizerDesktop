import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

export interface DialogData {
	defaultView: string;
}

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

	constructor(public dialogRef: MatDialogRef<SettingsComponent>) {}

	ngOnInit(): void {}

	saveButtonClicked(): void {
		this.dialogRef.close();	
	}
}
