import { BehaviorSubject } from "rxjs";
import { TaskNode } from "./task-node";

export class TaskDatabase {
	constructor(taskData) {
		this.initialize(taskData);
	}

	initialize(taskData) {
		this.dataChange.next(taskData);
	}

	buildTaskTree(obj: object, level: number): TaskNode[] {
		return Object.keys(obj).reduce<TaskNode[]>((accumulator, key) => {
			const value = obj[key];
			const task = new TaskNode();
			task.name = key;

			if (value != null) {
				if (typeof value === "object") {
					task.tasks = this.buildTaskTree(value, level + 1);
				}
				else {
					task.name = value;
				}
			}

			return accumulator.concat(task);
		}, []);
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

	insertItemBelow(node: TaskNode, name: string): TaskNode {
		const parentNode = this.getParentFromNodes(node);
		const newItem = { name: name } as TaskNode;
		if (parentNode != null) {
			parentNode.tasks.splice(parentNode.tasks.indexOf(node) + 1, 0, newItem);
		}
		else {
			this.data.splice(this.data.indexOf(node) + 1, 0, newItem);
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

	updateTask(task: TaskNode, name: string) {
		task.name = name;
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
