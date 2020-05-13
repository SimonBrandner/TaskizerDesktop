import { Component, OnInit, Input } from "@angular/core";
import { CdkDragDrop, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { isDataSource } from "@angular/cdk/collections";
import { concat } from "rxjs";

@Component({
	selector: "task",
	templateUrl: "./task.component.html",
	styleUrls: [
		"./task.component.css"
	]
})
export class TaskComponent implements OnInit {
	constructor() {}

	ngOnInit(): void {}

	collapseButtonClicked(): void {
		console.log("Expand/Collapse button clicked on task " + this.task.id);
		this.subtasksExpanded = !this.subtasksExpanded;
		this.subtasksExpanded ? (this.expandIcon = "expand_less") : (this.expandIcon = "expand_more");
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

	@Input() task: any;

	expandIcon = "expand_more";
	subtasksExpanded: boolean;
	@Input() connectedTasksIds: String[];
}
