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
		this.projects.push($event);
		this.configService.addProject($event.name, $event.path);
		this.projectService.createNewProject($event.name, $event.path);
	}

	isHandset: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.Handset);
	projects = [];
	defaultView: string;
}
