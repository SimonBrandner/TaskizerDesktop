import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DialogService } from "../../services/dialog.service";
import { ConfirmComponent } from "../confirm/confirm.component";
import { ConfigService } from "../../services/config.service";
import { ProjectService } from "../../services/project.service";
import { TaskNode } from "src/app/models/task-node";

@Component({
	selector: "task-menu",
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
		@Inject(MAT_DIALOG_DATA) public data: TaskNode,
		public dialog: MatDialog
	) {}

	ngOnInit(): void {}

	saveButtonClicked(): void {
		console.log("Save button clicked.");
		this.dialogRef.close({ name: this.data.name, level: 1, expandable: false, date: this.data.date });
	}
}
