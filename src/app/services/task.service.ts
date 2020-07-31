import { Injectable } from "@angular/core";
import { EventEmitter } from "protractor";
import { BehaviorSubject, Subject } from "rxjs";
import { FlatTaskNode } from "../classes/flat-task-node";
import { TaskNode } from "../classes/task-node";

@Injectable({
	providedIn: "root"
})
export class TaskService {
	constructor() {}

	addTask(task) {
		this.addTaskEvent.next(task);
	}

	addTaskEvent: Subject<TaskNode> = new Subject<TaskNode>();
}
