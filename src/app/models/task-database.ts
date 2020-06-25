import { BehaviorSubject } from "rxjs";
import { TaskNode } from "./task-node";
import { Task, BrowserWindow } from "electron";
import { element } from "protractor";

export class TaskDatabase {
	constructor(taskData) {
		this.initialize(taskData);
	}

	initialize(taskData) {
		const data = this.buildTaskTree(taskData, 0);

		this.dataChange.next(data);
	}

	buildTaskTree(obj: object, level: number): TaskNode[] {
		var tasks: TaskNode[] = [];

		obj["tasks"].forEach((element) => {
			var subtasks: TaskNode[];
			if (element["tasks"]) {
				subtasks = this.buildTaskTree(element, level + 1);
			}

			tasks.push({ name: element["name"], tasks: subtasks });
		});

		return tasks;
	}

	getProjectJSON() {
		return this.buildProjectJSON(this.dataChange.value);
	}

	buildProjectJSON(data: TaskNode[]) {
		var output: any = [];

		data.forEach((element) => {
			var subtasks = [];

			if (element.tasks) {
				subtasks = this.buildProjectJSON(element.tasks);
			}

			output.push({ name: element.name, tasks: subtasks });
		});

		return output;
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
		const newTask = { name: name } as TaskNode;
		if (parentNode != null) {
			parentNode.tasks.splice(parentNode.tasks.indexOf(node), 0, newTask);
		}
		else {
			this.data.splice(this.data.indexOf(node), 0, newTask);
		}
		this.dataChange.next(this.data);
		return newTask;
	}

	insertItemBelow(node: TaskNode, name: string): TaskNode {
		const parentNode = this.getParentFromNodes(node);
		const newTask = { name: name } as TaskNode;
		if (parentNode != null) {
			parentNode.tasks.splice(parentNode.tasks.indexOf(node) + 1, 0, newTask);
		}
		else {
			this.data.splice(this.data.indexOf(node) + 1, 0, newTask);
		}
		this.dataChange.next(this.data);
		return newTask;
	}

	getParentFromNodes(node: TaskNode): TaskNode {
		for (let i = 0; i < this.data.length; ++i) {
			const currentRoot = this.data[i];
			const parent = this.getParentTask(currentRoot, node);
			if (parent != null) {
				return parent;
			}
		}
		return null;
	}

	getParentTask(currentRoot: TaskNode, task: TaskNode): TaskNode {
		if (currentRoot.tasks && currentRoot.tasks.length > 0) {
			for (let i = 0; i < currentRoot.tasks.length; ++i) {
				const child = currentRoot.tasks[i];
				//console.log(child);
				if (child === task) {
					return currentRoot;
				}
				else if (child.tasks && child.tasks.length > 0) {
					const parent = this.getParentTask(child, task);
					if (parent != null) {
						return parent;
					}
				}
			}
		}
		return null;
	}

	updateTask(task: TaskNode, name: string) {
		task.name = name;
		this.dataChange.next(this.data);
	}

	addTask(task: TaskNode) {
		this.addTaskNode(this.data, task);
		this.dataChange.next(this.data);
	}

	deleteTask(task: TaskNode) {
		this.deleteTaskNode(this.data, task);
		this.dataChange.next(this.data);
	}

	copyPasteSubtask(from: TaskNode, to: TaskNode): TaskNode {
		const newItem = this.insertSubtask(to, from.name);
		if (from.tasks) {
			from.tasks.forEach((task) => {
				this.copyPasteSubtask(task, newItem);
			});
		}
		return newItem;
	}

	copyPasteTaskAbove(from: TaskNode, to: TaskNode): TaskNode {
		const newItem = this.insertItemAbove(to, from.name);
		if (from.tasks) {
			from.tasks.forEach((task) => {
				this.copyPasteSubtask(task, newItem);
			});
		}
		return newItem;
	}

	copyPasteTaskBelow(from: TaskNode, to: TaskNode): TaskNode {
		const newItem = this.insertItemBelow(to, from.name);
		if (from.tasks) {
			from.tasks.forEach((task) => {
				this.copyPasteSubtask(task, newItem);
			});
		}
		return newItem;
	}

	addTaskNode(tasks: TaskNode[], taskToAdd: TaskNode) {
		tasks.push(taskToAdd);
	}

	deleteTaskNode(tasks: TaskNode[], taskToDelete: TaskNode) {
		const index = tasks.indexOf(taskToDelete, 0);
		if (index > -1) {
			tasks.splice(index, 1);
		}
		else {
			tasks.forEach((task) => {
				if (task.tasks && task.tasks.length > 0) {
					this.deleteTaskNode(task.tasks, taskToDelete);
				}
			});
		}
	}

	get data(): TaskNode[] {
		return this.dataChange.value;
	}

	dataChange = new BehaviorSubject<TaskNode[]>([]);
}
