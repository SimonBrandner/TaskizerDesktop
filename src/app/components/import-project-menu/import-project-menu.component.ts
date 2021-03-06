import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DialogService } from "../../services/dialog.service";
import { ConfigService } from "../../services/config.service";
import { ProjectService } from "../../services/project.service";

@Component({
	selector: "import-project-menu",
	templateUrl: "./import-project-menu.component.html",
	styleUrls: [
		"./import-project-menu.component.scss"
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
				this.projectPathInput = result;
				console.log("Retrieved desired project location from user using DialogService", result);
			}
			else {
				console.log("DialogService returned undefined.");
			}
		});
	}

	saveButtonClicked(): void {
		console.log("Save button clicked.");
		this.projectService
			.getProjectByPath(this.projectPathInput)
			.then((result) => {
				var data = {};
				data["name"] = result["name"];
				data["path"] = this.projectPathInput;
				this.dialogRef.close(data);
			})
			.catch(() => {});
	}

	projectPathInput: string;
}
