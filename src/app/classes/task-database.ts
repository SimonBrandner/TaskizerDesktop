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
			var task = new TaskNode();

			if (element["tasks"]) {
				subtasks = this.buildTaskTree(element, level + 1);
			}

			task.name = element["name"];
			task.tasks = subtasks;
			task.isExpanded = element["isExpanded"];
			task.date = element["date"] == null ? null : new Date(element["date"]);
			task.repeat = {
				preset: element["repeat"]["preset"],
				ordinal: element["repeat"]["ordinal"],
				unit: element["repeat"]["unit"],
				category: element["repeat"]["category"]
			};
			task.reminders = [];
			element["reminders"].forEach((reminder) => {
				task.reminders.push(new Date(reminder));
			});

			tasks.push(task);
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

			output.push({
				name: element.name,
				tasks: subtasks,
				isExpanded: element.isExpanded,
				date: element.date,
				repeat: element.repeat,
				reminders: element.reminders
			});
		});

		return output;
	}

	insertSubtask(childTask: TaskNode, parentTask: TaskNode): TaskNode {
		if (!parentTask.tasks) {
			parentTask.tasks = [];
			parentTask.isExpanded = true;
		}
		const newTask = childTask;
		parentTask.tasks.push(newTask);
		this.dataChange.next(this.data);
		return newTask;
	}

	insertTaskAbove(topTask: TaskNode, bottomTask: TaskNode): TaskNode {
		const parentTask = this.getParentFromNodes(bottomTask);
		var newTask: TaskNode = {} as TaskNode;
		Object.assign(newTask, topTask);

		//var newTask = topTask;

		if (parentTask != null) {
			parentTask.tasks.splice(parentTask.tasks.indexOf(bottomTask), 0, newTask);
		}
		else {
			this.data.splice(this.data.indexOf(bottomTask), 0, newTask);
		}

		this.dataChange.next(this.data);
		return newTask;
	}

	insertTaskBelow(bottomTask: TaskNode, topTask: TaskNode): TaskNode {
		const parentTask = this.getParentFromNodes(topTask);
		var newTask: TaskNode = {} as TaskNode;
		Object.assign(newTask, bottomTask);

		//var newTask = bottomTask;

		if (parentTask != null) {
			parentTask.tasks.splice(parentTask.tasks.indexOf(topTask) + 1, 0, newTask);
		}
		else {
			this.data.splice(this.data.indexOf(topTask) + 1, 0, newTask);
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

	taskExpansionHandler(task: TaskNode) {
		task.isExpanded = !task.isExpanded;
		this.dataChange.next(this.data);
	}

	updateDatabase() {
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
		const newItem = this.insertSubtask(to, from);
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
