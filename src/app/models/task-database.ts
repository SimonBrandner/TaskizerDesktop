import { SelectionModel } from "@angular/cdk/collections";
import { FlatTreeControl } from "@angular/cdk/tree";
import { Component, Injectable, ElementRef, ViewChild } from "@angular/core";
import { MatTreeFlatDataSource, MatTreeFlattener } from "@angular/material/tree";
import { BehaviorSubject, from } from "rxjs";
import { TaskNode } from "./task-node";

@Injectable()
export class TaskDatabase {
	constructor(taskData) {
		this.initialize(taskData);
	}

	initialize(taskData) {
		this.dataChange.next(taskData);
	}

	get data(): TaskNode[] {
		return this.dataChange.value;
	}

	insertSubtask(parent: TaskNode, name: string): TaskNode {
		if (!parent.tasks) {
			parent.tasks = [];
		}
		const newTask = { name: name } as TaskNode;
		parent.tasks.push(newTask);
		this.dataChange.next(this.data);
		return newTask;
	}

	dataChange = new BehaviorSubject<TaskNode[]>([]);
}
