import { Component, OnInit } from "@angular/core";
import { ConfigService } from "../../services/config.service";
import { ProjectService } from "../../services/project.service";
import { ActivatedRoute } from "@angular/router";
import { AlgorithmsService } from "../../services/algorithms.service";
import { CdkDragDrop, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { Router } from "@angular/router";
import { Location } from "@angular/common";

@Component({
	selector: "app-project",
	templateUrl: "./project.component.html",
	styleUrls: [
		"./project.component.css"
	]
})
export class ProjectComponent implements OnInit {
	constructor(
		route: ActivatedRoute,
		configService: ConfigService,
		projectService: ProjectService,
		algorithmsService: AlgorithmsService
	) {
		route.params.subscribe((params) => {
			console.log("Switched to project with id: " + params["id"]);
			this.projectId = params["id"];
			configService.getProjectById(this.projectId).then((result) => {
				this.projectPath = result["path"];
				console.log("Retrieved project path from ConfigService.");
				console.log("The project path is: " + this.projectPath);
				projectService.getProjectByPath(this.projectPath).then((result) => {
					this.project = result;
					console.log("Retrieved project " + this.project.name + " from ProjectService.");
					this.taskIds = algorithmsService.findAllTaskIdsInProject(this.project, this.topLevelId);
					console.log("Retrieved all task ids from AlgorithmsService" + this.taskIds);
				});
			});
		});
	}

	drop(event: CdkDragDrop<string[]>): void {
		console.log(event);

		if (event.previousContainer === event.container) {
			moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
		}
		else {
			transferArrayItem(
				event.previousContainer.data,
				event.container.data,
				event.previousIndex,
				event.currentIndex
			);
		}
	}

	ngOnInit(): void {}

	project: any;
	projectId: number;
	projectPath: string;
	taskIds: String[];
	topLevelId: String = "-1";
}