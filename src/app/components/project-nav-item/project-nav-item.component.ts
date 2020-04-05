import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ProjectMenuComponent } from "../project-menu/project-menu.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";

@Component({
	selector: "project-nav-item",
	templateUrl: "./project-nav-item.component.html",
	styleUrls: [
		"./project-nav-item.component.css"
	]
})
export class ProjectNavItemComponent implements OnInit {
	constructor(public dialog: MatDialog) {}

	ngOnInit(): void {}

	editProjectClicked(): void {
		const dialogRef = this.dialog.open(ProjectMenuComponent, {
			data: { id: this.project.id, name: this.project.name, path: this.project.path }
		});
		dialogRef.afterClosed().subscribe((result) => {
			if (result == null) {
			}
			else if (result == "deleteProject") {
				this.deleteProjectOutput.emit(this.project.id);
			}
			else {
				this.editProjectOutput.emit({ id: this.project.id, name: result.name, path: result.path });
			}
		});
	}

	@Input() project;
	@Output() editProjectOutput = new EventEmitter<Object>();
	@Output() deleteProjectOutput = new EventEmitter<Object>();
}
