import { Injectable } from "@angular/core";
import { EventEmitter } from "protractor";
import { BehaviorSubject } from "rxjs";

@Injectable({
	providedIn: "root"
})
export class TaskService {
	constructor() {}

	addTask(task) {
		this.addTaskEvent.next(task);
	}

	addTaskEvent: BehaviorSubject<Object> = new BehaviorSubject({});
}
