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

	insertItemAbove(node: TaskNode, name: string): TaskNode {
		const parentNode = this.getParentFromNodes(node);
		const newItem = { name: name } as TaskNode;
		if (parentNode != null) {
			parentNode.tasks.splice(parentNode.tasks.indexOf(node), 0, newItem);
		}
		else {
			this.data.splice(this.data.indexOf(node), 0, newItem);
		}
		this.dataChange.next(this.data);
		return newItem;
	}

	getParentFromNodes(node: TaskNode): TaskNode {
		this.data.forEach((element) => {
			const parent = this.getParentTask(element, node);
			if (parent != null) {
				return parent;
			}
		});
		return null;
	}

	getParentTask(currentRoot: TaskNode, task: TaskNode): TaskNode {
		if (currentRoot.tasks && currentRoot.tasks.length > 0) {
			currentRoot.tasks.forEach((currentTask) => {
				if (currentTask === task) {
					return currentRoot;
				}
				else {
					const parent = this.getParentTask(currentTask, task);
					if (parent != null) {
						return parent;
					}
				}
			});
		}
		return null;
	}

	dataChange = new BehaviorSubject<TaskNode[]>([]);
}
