import { Component, OnInit } from "@angular/core";
import { BreakpointObserver, Breakpoints, BreakpointState } from "@angular/cdk/layout";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { Observable } from "rxjs";
import { ConfigService } from "../../services/config.service";
import { ProjectService } from "../../services/project.service";
import { SettingsComponent } from "../settings/settings.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";

@Component({
	selector: "navigation",
	templateUrl: "./navigation.component.html",
	styleUrls: [
		"./navigation.component.css"
	]
})
export class NavigationComponent implements OnInit {
	constructor(
		private breakpointObserver: BreakpointObserver,
		private configService: ConfigService,
		private projectService: ProjectService,
		public dialog: MatDialog
	) {
		configService.getProjects().then((result) => {
			this.projects = result;
		});
	}

	ngOnInit() {}

	drop(event: CdkDragDrop<string[]>): void {
		moveItemInArray(this.projects, event.previousIndex, event.currentIndex);
	}

	settingsButtonClicked(): void {
		const dialogRef = this.dialog.open(SettingsComponent);
	}

	addProjectEvent($event): void {
		this.configService.getIdForNewProject().then((result) => {
			this.projects.push({ id: result, name: $event.name, path: $event.path });
			this.configService.addProject($event.name, $event.path);
			this.projectService.createNewProject($event.name, $event.path);
		});
	}

	editProjectEvent($event): void {
		this.configService.getProjectById($event.id).then((oldProject) => {
			var changedProjectIndex;
			this.projects.forEach((value, index) => {
				if (value.id == $event.id) {
					value = $event;
					changedProjectIndex = index;
				}
			});

			this.projects[changedProjectIndex] = $event;
			this.projectService.editProject(oldProject, $event);
			this.configService.editProject($event);
		});
	}

	isHandset: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.Handset);
	projects = [];
	defaultView: string;
}
