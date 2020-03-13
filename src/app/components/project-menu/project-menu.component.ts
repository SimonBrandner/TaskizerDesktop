import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { DialogService } from "../../services/dialog.service";
import { ConfigService } from "../../services/config.service";
import { MatInputModule } from "@angular/material/input";

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
		private configService: ConfigService
	) {}

	ngOnInit(): void {}

	pathButtonClicked(): void {
		this.dialogService.saveDialogSync().then((result) => {
			this.path = result;
		});
	}

	saveButtonClicked(): void {
		if (this.path != null || this.name != null) {
			this.configService.addProject(this.name, this.path);
			this.dialogRef.close();
		}
		else {
		}

		// TODO Make sure path input is a path and add better required warning
	}

	path: string;
	name: string;
}
