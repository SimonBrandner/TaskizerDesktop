import { Component, OnInit, Input } from "@angular/core";
import { FlatTaskNode } from "../../classes/flat-task-node";

@Component({
	selector: "task-date",
	templateUrl: "./task-date.component.html",
	styleUrls: [
		"./task-date.component.scss"
	]
})
export class TaskDateComponent implements OnInit {
	constructor() {}

	ngOnInit(): void {}

	@Input() task: FlatTaskNode;
}
