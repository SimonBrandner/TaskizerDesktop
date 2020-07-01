import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DialogService } from "../../services/dialog.service";
import { ConfirmComponent } from "../confirm/confirm.component";
import { ConfigService } from "../../services/config.service";
import { ProjectService } from "../../services/project.service";
import { Router } from "@angular/router";

@Component({
	selector: "import-project-menu",
	templateUrl: "./import-project-menu.component.html",
	styleUrls: [
		"./import-project-menu.component.css"
	]
})
export class ImportProjectMenuComponent implements OnInit {
	constructor(
		public dialogRef: MatDialogRef<ImportProjectMenuComponent>,
		private dialogService: DialogService,
		private projectService: ProjectService,
		private configService: ConfigService,
		public dialog: MatDialog
	) {}

	ngOnInit(): void {}

	pathButtonClicked(): void {
		console.log("Path button clicked.");
		this.dialogService.importProjectDialog().then((result) => {
			if (result != undefined) {
				this.projectPathInput = result[0];
				console.log("Retrieved desired project location from user using DialogService.");
			}
			else {
				console.log("DialogService returned undefined.");
			}
		});
	}

	saveButtonClicked(): void {
		console.log("Save button clicked.");
		this.projectService.getProjectByPath(this.projectPathInput).then((result) => {
			var data = {};
			data["name"] = result["name"];
			data["path"] = this.projectPathInput;
			// TODO Make sure path input is a path
			this.dialogRef.close(data);
		});
	}

	projectPathInput: string;
}
