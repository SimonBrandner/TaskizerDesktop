import { Component, OnInit } from "@angular/core";
import { ConfigService } from "../../services/config.service";
import { ProjectService } from "../../services/project.service";

@Component({
	selector: "app-project",
	templateUrl: "./project.component.html",
	styleUrls: [
		"./project.component.css"
	]
})
export class ProjectComponent implements OnInit {
	constructor() {
		// Get info about route, print it and fix issues if present.
		// Retrieve project json
	}

	ngOnInit(): void {}
}
