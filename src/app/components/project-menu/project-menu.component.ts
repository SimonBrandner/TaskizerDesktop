import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DialogService } from "../../services/dialog.service";
import { ConfirmComponent } from "../confirm/confirm.component";
import { ConfigService } from "../../services/config.service";
import { ProjectService } from "../../services/project.service";
import { Router } from "@angular/router";

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
		public dialog: MatDialog,
		private router: Router
	) {
		this.folderPath = projectService.getFolderPathFromFullPath(data.path);
		this.setProjectPath();
	}

	ngOnInit(): void {}

	pathButtonClicked(): void {
		console.log("Path button clicked.");
		this.dialogService.saveProjectDialog(this.data.name).then((result) => {
			if (result != undefined) {
				this.pathSetManually = true;
				this.data.path = result;
				console.log("Retrieved desired project location from user using DialogService.");
			}
			else {
				console.log("DialogService returned undefined.");
			}
		});
	}

	saveButtonClicked(): void {
		console.log("Save button clicked.");
		this.setProjectPath();
		this.dialogRef.close(this.data);
		// TODO Make sure path input is a path
	}

	deleteProjectClicked(): void {
		console.log("Delete project button clicked.");
		const dialogRef = this.dialog.open(ConfirmComponent, {
			data: "you want to delete this project?"
		});
		console.log("Open ConfirmComponent dialog.");
		dialogRef.afterClosed().subscribe((result) => {
			if (result == true) {
				this.projectService.deleteProject(this.data.path);
				console.log("Deleting project using ProjectService.");
				this.configService.deleteProject(this.data.id);
				console.log("Deleting project using ConfigService.");
				this.dialogRef.close("deleteProject");
				this.configService.getDefaultView().then((result) => {
					this.router.navigate([
						result.toLowerCase()
					]);
					console.log("Redirected to defaultView.");
				});
			}
		});
	}

	setProjectPath() {
		if (!this.pathSetManually) {
			this.data.path = this.folderPath + "/" + this.data.name + ".taskizer";
		}
	}

	pathSetManually: boolean = false;
	folderPath: string;
}
