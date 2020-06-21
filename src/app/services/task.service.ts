import { Injectable } from "@angular/core";
import { EventEmitter } from "protractor";
import { BehaviorSubject, Subject } from "rxjs";
import { FlatTaskNode } from "../models/flat-task-node";
import { TaskNode } from "../models/task-node";

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
