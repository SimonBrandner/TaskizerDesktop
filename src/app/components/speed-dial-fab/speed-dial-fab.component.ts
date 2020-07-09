import { Component, OnInit, Output, EventEmitter, NgZone } from "@angular/core";
import { speedDialFabAnimations } from "./speed-dial-fab.animations";
import { ProjectMenuComponent } from "../project-menu/project-menu.component";
import { MatDialog } from "@angular/material/dialog";
import { ConfigService } from "src/app/services/config.service";
import { TaskMenuComponent } from "../task-menu/task-menu.component";
import { TaskService } from "../../services/task.service";
import { TaskNode } from "src/app/models/task-node";
import { ImportProjectMenuComponent } from "../import-project-menu/import-project-menu.component";
import { MenuService } from "../../services/menu.service";

@Component({
	selector: "speed-dial-fab",
	templateUrl: "./speed-dial-fab.component.html",
	styleUrls: [
		"./speed-dial-fab.component.css"
	],
	animations: speedDialFabAnimations
})
export class SpeedDialFabComponent implements OnInit {
	constructor(
		public dialog: MatDialog,
		private configService: ConfigService,
		private taskService: TaskService,
		private menuService: MenuService,
		private zone: NgZone
	) {}

	ngOnInit(): void {
		this.menuService.newProjectEvent.subscribe(() => {
			console.log("newProject");
			this.zone.run(() => {
				this.addProject();
			});
		});
		this.menuService.importProjectEvent.subscribe(() => {
			console.log("importProject");
			this.zone.run(() => {
				this.importProject();
			});
		});
		this.menuService.newTaskEvent.subscribe(() => {
			console.log("newTask");
			this.zone.run(() => {
				this.addTask();
			});
		});
	}

	showItems(): void {
		console.log("Showing items.");
		this.fabTogglerState = "active";
		this.buttons = this.fabButtons;
	}

	hideItems(): void {
		console.log("Hiding items.");
		this.fabTogglerState = "inactive";
		this.buttons = [];
	}

	onToggleFab(): void {
		this.buttons.length ? this.hideItems() : this.showItems();
	}

	addProject() {
		console.log("Add project button clicked.");
		this.configService.getDefaultProjectPath().then((result) => {
			console.log("Retrieved defaultProjectPath from ConfigService.");
			var name: string = "New project";
			var extension: string = ".taskizer";
			const dialogRef = this.dialog.open(ProjectMenuComponent, {
				data: { name: name, path: result + "/" + name + extension }
			});
			console.log("Opened ProjectMenuComponent dialog.");
			dialogRef.afterClosed().subscribe((result) => {
				if (result == null) {
					console.log("New project empty.");
					return;
				}
				this.createNewProjectOutput.emit(result);
			});
		});
	}

	addTask(): void {
		console.log("Add task button clicked.");
		const dialogRef = this.dialog.open(TaskMenuComponent, {
			data: { name: "New task", date: undefined } as TaskNode
		});
		console.log("Opened TaskMenuComponent dialog.");
		dialogRef.afterClosed().subscribe((result: TaskNode) => {
			if (result == null) {
				console.log("New task empty.");
			}
			else {
				this.taskService.addTask(result);
			}
		});
	}

	importProject(): void {
		console.log("Import project button clicked.");
		const dialogRef = this.dialog.open(ImportProjectMenuComponent);
		console.log("Opened ImportProjectMenuComponent dialog.");
		dialogRef.afterClosed().subscribe((result) => {
			if (result == null) {
				console.log("Imported project empty.");
				return;
			}
			this.createNewProjectOutput.emit(result);
		});
	}

	fabItemButtonClicked(buttonName): void {
		if (buttonName == "addProject") {
			this.addProject();
		}
		else if (buttonName == "addTask") {
			this.addTask();
		}
		else if (buttonName == "importProject") {
			this.importProject();
		}

		this.hideItems();
	}

	@Output() createNewProjectOutput = new EventEmitter<Object>();

	fabButtons = [
		{
			icon: "add",
			name: "addTask"
		},
		{
			icon: "post_add",
			name: "addProject"
		},
		{
			icon: "import_export",
			name: "importProject"
		}
	];

	buttons = [];
	fabTogglerState = "inactive";
}
