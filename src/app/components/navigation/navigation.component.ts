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
			console.log("Retrieved projects from ConfigService.");
		});
	}

	ngOnInit() {}

	drop(event: CdkDragDrop<string[]>): void {
		console.log("Project dropped.");
		moveItemInArray(this.projects, event.previousIndex, event.currentIndex);
		console.log("Saved reordered projects to the projects array.");
		this.configService.orderProjects(this.projects);
		console.log("Saving reordered projects using ConfigService.");
	}

	settingsButtonClicked(): void {
		console.log("Settings button clicked.");
		const dialogRef = this.dialog.open(SettingsComponent);
	}

	addProjectEvent($event): void {
		this.configService.getIdForNewProject().then((result) => {
			console.log("New project id retrieved from ConfigService.");
			this.projects.push({ id: result, name: $event.name, path: $event.path });
			console.log("Project added to the projects array.");
			this.configService.addProject($event.name, $event.path);
			console.log("Adding project using ConfigService.");
			this.projectService.createNewProject($event.name, $event.path);
			console.log("Saving project using ProjectService.");
		});
	}

	editProjectEvent($event): void {
		this.configService.getProjectById($event.id).then((oldProject) => {
			console.log("Project retrieved from ConfigService.");
			var changedProjectIndex;
			this.projects.forEach((value, index) => {
				if (value.id == $event.id) {
					value = $event;
					changedProjectIndex = index;
				}
			});
			console.log("Changed projects index found.");

			this.projects[changedProjectIndex] = $event;
			console.log("Saved project changes to the projects array.");
			this.projectService.editProject(oldProject, $event);
			console.log("Saving project changes using ProjectService.");
			this.configService.editProject($event);
			console.log("Saving project changes using ConfigService.");
		});
	}

	deleteProjectEvent($event): void {
		this.projects.forEach((element, index) => {
			if (element.id == $event) {
				this.projects.splice(index, 1);
				console.log("Project deleted from projects array.");
				return;
			}
		});
	}

	isHandset: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.Handset);
	projects = [];
	defaultView: string;
}
