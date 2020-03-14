import { Component, OnInit } from "@angular/core";
import { speedDialFabAnimations } from "./speed-dial-fab.animations";
import { ProjectMenuComponent } from "../project-menu/project-menu.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ConfigService } from "src/app/services/config.service";

@Component({
	selector: "speed-dial-fab",
	templateUrl: "./speed-dial-fab.component.html",
	styleUrls: [
		"./speed-dial-fab.component.css"
	],
	animations: speedDialFabAnimations
})
export class SpeedDialFabComponent implements OnInit {
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

	constructor(public dialog: MatDialog, private configService: ConfigService) {}

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
			const dialogRef = this.dialog.open(ProjectMenuComponent, {
				data: { name: "New project", path: result + "newProject.taskizer" }
			});
		});

		// TODO: Receive data form dialogRef
	}

	addTask(): void {}

	fabItemButtonClicked(buttonName): void {
		buttonName == "addProject" ? this.addProject() : this.addTask();
		this.hideItems();
	}

	ngOnInit(): void {}
}
