import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { DialogService } from "../../services/dialog.service";
import { ConfigService } from "../../services/config.service";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

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
		private configService: ConfigService,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {}

	ngOnInit(): void {}

	pathButtonClicked(): void {
		this.dialogService.saveDialogSync().then((result) => {
			this.data.path = result;
		});
	}

	saveButtonClicked(): void {
		this.configService.addProject(this.data.name, this.data.path);
		this.dialogRef.close(this.data);

		// TODO Make sure path input is a path
	}
}
