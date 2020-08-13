import { Component, OnInit, HostListener, NgZone } from "@angular/core";
import { BreakpointObserver, Breakpoints, BreakpointState } from "@angular/cdk/layout";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { Observable, Subject, BehaviorSubject } from "rxjs";
import { ConfigService } from "../../services/config.service";
import { ProjectService } from "../../services/project.service";
import { SettingsComponent } from "../settings/settings.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { NotificationService } from "../../services/notification.service";
import { Router } from "@angular/router";

@Component({
	selector: "navigation",
	templateUrl: "./navigation.component.html",
	styleUrls: [
		"./navigation.component.scss"
	]
})
export class NavigationComponent implements OnInit {
	constructor(
		private breakpointObserver: BreakpointObserver,
		private configService: ConfigService,
		private projectService: ProjectService,
		private notificationService: NotificationService,
		private zone: NgZone,
		private router: Router,
		public dialog: MatDialog
	) {}

	ngOnInit() {
		this.windowSize.next([
			window.innerWidth,
			window.innerHeight
		]);

		this.projects = this.configService.getProjects();
		console.log("Retrieved projects from ConfigService", this.projects);

		this.notificationService.focusOnTaskEvent.subscribe((value) => {
			this.zone.run(() => {
				this.focusOnTaskEvent(value);
			});
		});
	}

	drop(event: CdkDragDrop<string[]>): void {
		console.log("Project dropped.");
		moveItemInArray(this.projects, event.previousIndex, event.currentIndex);
		console.log("Saved reordered projects to the projects array.");
		this.configService.setProjects(this.projects);
		console.log("Saving reordered projects using ConfigService.");
	}

	refreshButtonClicked(): void {
		this.configService.load();
	}

	settingsButtonClicked(): void {
		console.log("Settings button clicked.");
		var dio = this.dialog.open(SettingsComponent);
		this.windowSize.subscribe((data) => {
			dio.updateSize((data[0] - 500).toString() + "px", (data[1] - 250).toString() + "px");
		});
	}

	focusOnTaskEvent(payload: any): void {
		console.log("Focusing on task", payload);

		this.router.navigate([
			"/project",
			payload.projectId
		]);
	}

	addProjectEvent($event): void {
		console.log("New project id retrieved from ConfigService.");
		this.configService.addProject($event.name, $event.path);
		console.log("Adding project using ConfigService.");
		this.projectService.createNewProject($event.name, $event.path);
		console.log("Saving project using ProjectService.");
		this.configService.load();
	}

	editProjectEvent($event): void {
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
		this.projectService.editProject(this.configService.getProjectById($event.id), $event);
		console.log("Saving project changes using ProjectService.");
		this.configService.setProject($event);
		console.log("Saving project changes using ConfigService.");
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

	setSelectedProject(projectId: number) {
		this.selectedProjectId = projectId;
		console.log("selectedProjectId has been set.");
	}

	@HostListener("window:resize", [
		"$event"
	])
	onResize(event) {
		this.windowSize.next([
			event.target.innerWidth,
			event.target.innerHeight
		]);
	}

	isHandset: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.Handset);
	projects = [];
	defaultView: string;
	selectedProjectId: number;

	windowSize: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
}
