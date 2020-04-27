import { Component, OnInit, Input } from "@angular/core";

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
		this.subtasksExpanded = !this.subtasksExpanded;
		this.subtasksExpanded ? (this.expandIcon = "expand_less") : (this.expandIcon = "expand_more");
	}

	@Input() task: any;

	expandIcon = "expand_more";
	subtasksExpanded: boolean;
}
