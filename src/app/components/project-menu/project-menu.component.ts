import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DialogService } from "../../services/dialog.service";
import { ConfirmComponent } from "../confirm/confirm.component";
import { ConfigService } from "../../services/config.service";
import { ProjectService } from "../../services/project.service";

@Component({
	selector: "app-project-menu",
	templateUrl: "./project-menu.component.html",
	styleUrls: [
		"./project-menu.component.css"
	]
})
export class ProjectMenuComponent implements OnInit {
	constructor(
		public dialogRef: MatDialogRef<ProjectMenuComponent>,
		private dialogService: DialogService,
		private projectService: ProjectService,
		private configService: ConfigService,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialog: MatDialog
	) {}

	ngOnInit(): void {}

	pathButtonClicked(): void {
		this.dialogService.saveDialogSync().then((result) => {
			this.data.path = result;
		});
	}

	saveButtonClicked(): void {
		this.dialogRef.close(this.data);

		// TODO Make sure path input is a path
	}

	deleteProjectClicked(): void {
		const dialogRef = this.dialog.open(ConfirmComponent, {
			data: "you want to delete this project?"
		});
		dialogRef.afterClosed().subscribe((result) => {
			if (result == true) {
				this.projectService.deleteProject(this.data.path);
				this.configService.deleteProject(this.data.id);
				this.dialogRef.close("deleteProject");
			}
		});
	}
}
