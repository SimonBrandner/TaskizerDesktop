import { Component, OnInit, HostListener, NgZone } from "@angular/core";
import { BreakpointObserver, Breakpoints, BreakpointState } from "@angular/cdk/layout";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { Observable, Subject, BehaviorSubject, from } from "rxjs";
import { ConfigService } from "../../services/config.service";
import { ProjectService } from "../../services/project.service";
import { SettingsComponent } from "../settings/settings.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { NotificationService } from "../../services/notification.service";
import { Router } from "@angular/router";
import { MenuService } from "../../services/menu.service";
import { MatSnackBar, MatSnackBarDismiss } from "@angular/material/snack-bar";

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
		private menuService: MenuService,
		private zone: NgZone,
		private router: Router,
		public dialog: MatDialog,
		private snackBar: MatSnackBar
	) {}

	ngOnInit() {
		this.windowSize.next([
			window.innerWidth,
			window.innerHeight
		]);

		this.projects = this.configService.getProjects();

		this.configService.change.subscribe(() => {
			console.log("Registered config change.");
			this.projects = this.configService.getProjects();
		});

		this.setSelectedProject(-1);

		this.notificationService.focusOnTaskEvent.subscribe((value) => {
			this.zone.run(() => {
				this.focusOnTaskEvent(value);
			});
		});

		this.menuService.nextNavItemEvent.subscribe(() => {
			console.log("Next navigation item");
			this.zone.run(() => {
				this.nextNavItem();
			});
		});

		this.menuService.previousNavItemEvent.subscribe(() => {
			console.log("Previous navigation item");
			this.zone.run(() => {
				this.previousNavItem();
			});
		});
	}

	nextNavItem() {
		console.log("Current selected project index is:", this.selectedProjectIndex);
		if (this.selectedProjectIndex == this.projects.length - 1) {
			this.router.navigate([
				"today"
			]);
			this.selectedProjectIndex = -1;
			return;
		}
		if (this.selectedProjectIndex == -1) {
			this.router.navigate([
				"project",
				this.projects[0].id
			]);
			this.selectedProjectIndex = 0;
			return;
		}
		this.router.navigate([
			"project",
			this.projects[this.selectedProjectIndex + 1].id
		]);
		this.selectedProjectIndex++;
	}

	previousNavItem() {
		console.log("Current selected project index is:", this.selectedProjectIndex);
		if (this.selectedProjectIndex == 0) {
			this.router.navigate([
				"today"
			]);
			this.selectedProjectIndex = -1;
			return;
		}
		if (this.selectedProjectIndex == -1) {
			this.router.navigate([
				"project",
				this.projects[this.projects.length - 1].id
			]);
			this.selectedProjectIndex = this.projects.length - 1;
			return;
		}

		this.router.navigate([
			"project",
			this.projects[this.selectedProjectIndex - 1].id
		]);
		this.selectedProjectIndex--;
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

		console.log("Current selectedProjectIndex is:", this.selectedProjectIndex);
		if (this.selectedProjectIndex == -1) {
			this.router.navigate([
				"today"
			]);
		}
		else {
			this.router.navigate([
				"project",
				this.projects[this.selectedProjectIndex].id
			]);
		}
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
		this.router.navigate([
			"project",
			this.configService.getProjectByPath($event.path)["id"]
		]);
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
		var project: any = this.configService.getProjectById($event);

		var projectsBackUp = new Array<any>();
		Object.assign(projectsBackUp, this.projects);
		console.log("Created projects back up:", projectsBackUp);

		this.deleteProjectFromProjectsArray($event);

		this.router.navigate([
			this.configService.getDefaultView().toLowerCase()
		]);
		console.log("Redirected to defaultView.");

		console.log("Opening SnackBar.");
		var snackBarRef = this.snackBar.open("Project " + project.name + " completed!", "Undo", {
			duration: 5000
		});

		snackBarRef.onAction().subscribe(() => {
			console.log("Undo clicked");
			this.projects = projectsBackUp;
		});

		snackBarRef.afterDismissed().subscribe((info: MatSnackBarDismiss) => {
			console.log("SnackBar dismissed:", info);
			if (!info.dismissedByAction) {
				try {
					this.projectService.deleteProject(project.path);
				} catch (error) {
					console.log(error);
				}

				this.configService.deleteProject(project.id);
			}
		});
	}

	deleteProjectFromProjectsArray(projectId: number) {
		this.projects.forEach((element, index) => {
			if (element.id == projectId) {
				this.projects.splice(index, 1);
				console.log("Project deleted from projects array.");
				return;
			}
		});
	}

	setSelectedProject(index) {
		this.selectedProjectIndex = index;
		console.log("selectedProjectIndex has been set to", index);
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
	selectedProjectIndex: number;

	windowSize: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
}
