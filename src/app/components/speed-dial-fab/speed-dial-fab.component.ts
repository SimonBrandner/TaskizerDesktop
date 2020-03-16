import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { speedDialFabAnimations } from "./speed-dial-fab.animations";
import { ProjectMenuComponent } from "../project-menu/project-menu.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ConfigService } from "src/app/services/config.service";
import { pathToFileURL } from "url";

@Component({
	selector: "speed-dial-fab",
	templateUrl: "./speed-dial-fab.component.html",
	styleUrls: [
		"./speed-dial-fab.component.css"
	],
	animations: speedDialFabAnimations
})
export class SpeedDialFabComponent implements OnInit {
	constructor(public dialog: MatDialog, private configService: ConfigService) {}

	ngOnInit(): void {}

	showItems(): void {
		this.fabTogglerState = "active";
		this.buttons = this.fabButtons;
	}

	hideItems(): void {
		this.fabTogglerState = "inactive";
		this.buttons = [];
	}

	onToggleFab(): void {
		this.buttons.length ? this.hideItems() : this.showItems();
	}

	addProject(): void {
		this.configService.getDefaultProjectPath().then((result) => {
			var name: String;
			const dialogRef = this.dialog.open(ProjectMenuComponent, {
				data: { name: "New project", path: result + "newProject.taskizer" }
			});
			dialogRef.afterClosed().subscribe((result) => {
				this.projectNameOutput.emit(result);
				console.log(result);
			});
		});
	}

	addTask(): void {}

	fabItemButtonClicked(buttonName): void {
		buttonName == "addProject" ? this.addProject() : this.addTask();
		this.hideItems();
	}

	@Output() projectNameOutput = new EventEmitter<Object>();

	fabButtons = [
		{
			icon: "playlist_add",
			name: "addProject"
		},
		{
			icon: "check_circle",
			name: "addTask"
		}
	];

	buttons = [];
	fabTogglerState = "inactive";
}
