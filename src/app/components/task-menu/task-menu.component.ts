import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DialogService } from "../../services/dialog.service";
import { ConfirmComponent } from "../confirm/confirm.component";
import { ConfigService } from "../../services/config.service";
import { ProjectService } from "../../services/project.service";

@Component({
	selector: "app-task-menu",
	templateUrl: "./task-menu.component.html",
	styleUrls: [
		"./task-menu.component.css"
	]
})
export class TaskMenuComponent implements OnInit {
	constructor(
		public dialogRef: MatDialogRef<TaskMenuComponent>,
		private dialogService: DialogService,
		private projectService: ProjectService,
		private configService: ConfigService,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialog: MatDialog
	) {}

	ngOnInit(): void {}

	pathButtonClicked(): void {
		console.log("Path button clicked.");
		this.dialogService.saveDialogSync().then((result) => {
			this.data.path = result;
			console.log("Retrieved desired project location from user using DialogService");
		});
	}

	saveButtonClicked(): void {
		console.log("Save button clicked.");
		this.dialogRef.close(this.data);
		// TODO Make sure path input is a path
	}
}
