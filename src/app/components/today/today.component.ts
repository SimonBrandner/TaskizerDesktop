import { Component, OnInit, ViewChild, ElementRef, EventEmitter } from "@angular/core";
import { ConfigService } from "../../services/config.service";
import { ProjectService } from "../../services/project.service";
import { ActivatedRoute } from "@angular/router";
import { MatTreeFlatDataSource, MatTreeFlattener } from "@angular/material/tree";
import { FlatTreeControl } from "@angular/cdk/tree";
import { Observable, of } from "rxjs";
import { FlatTaskNode } from "../../classes/flat-task-node";
import { TaskNode } from "../../classes/task-node";
import { TaskDatabase } from "../../classes/task-database";
import { SelectionModel } from "@angular/cdk/collections";
import { TaskService } from "../../services/task.service";
import { TaskMenuComponent } from "../task-menu/task-menu.component";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmComponent } from "../confirm/confirm.component";
import { Algorithms } from "src/app/classes/algorithms";

@Component({
	selector: "today",
	templateUrl: "./today.component.html",
	styleUrls: [
		"./today.component.scss"
	]
})
export class TodayComponent implements OnInit {
	constructor(
		private configService: ConfigService,
		private projectService: ProjectService,
		private taskService: TaskService,
		public dialog: MatDialog
	) {
		this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
		this.treeControl = new FlatTreeControl<FlatTaskNode>(this.getLevel, this.isExpandable);
		this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
	}

	ngOnInit(): void {
		var projectPaths = this.configService.getProjectPaths();
		console.log("Retrieved project paths from ConfigService:", projectPaths);

		this.getTodayTaskData(projectPaths).then((result) => {
			console.log("Tasks with dates:", result);
			this.database = new TaskDatabase({ tasks: result });
			console.log("Pushed data to TaskDatabase.");
			this.database.dataChange.subscribe((data) => {
				console.log("Data in database changed.");
				this.dataSource.data = [];
				this.dataSource.data = data;
				this.nestedTaskMap.forEach((element) => {
					element.isExpanded ? this.treeControl.expand(element) : this.treeControl.collapse(element);
				});
			});
		});
	}

	async getTodayTaskData(projectPaths: Array<string>): Promise<Array<TaskNode>> {
		return new Promise<Array<TaskNode>>((resolve) => {
			projectPaths.forEach((projectPath) => {
				this.projectService.getProjectByPath(projectPath).then((result) => {
					resolve(this.getTaskWithDates(result["tasks"]));
				});
			});
		});
	}

	getTaskWithDates(tasks: Array<TaskNode>): Array<TaskNode> {
		var tasksWithDates: Array<TaskNode> = [];

		tasks.forEach((task) => {
			if (task.date != null || task.reminders.length > 0) {
				tasksWithDates.push(task);
			}
			else {
				tasksWithDates = tasksWithDates.concat(this.getTaskWithDates(task.tasks));
			}
		});

		return tasksWithDates;
	}

	transformer = (task: TaskNode, level: number) => {
		const existingTask = this.nestedTaskMap.get(task);
		const flatTask = existingTask && existingTask.name === task.name ? existingTask : new FlatTaskNode();
		flatTask.name = task.name;
		flatTask.level = level;
		flatTask.expandable = task.tasks && task.tasks.length > 0;
		flatTask.isExpanded = task.isExpanded;
		flatTask.date = task.date;
		flatTask.repeat = task.repeat;
		flatTask.reminders = task.reminders;
		flatTask.id = task.id;
		this.flatTaskMap.set(flatTask, task);
		this.nestedTaskMap.set(task, flatTask);
		return flatTask;
	};

	editTask(task: FlatTaskNode) {
		console.log("Edit task button clicked", task);
		const dialogRef = this.dialog.open(TaskMenuComponent, {
			data: this.flatTaskMap.get(task)
		});
		console.log("Opened TaskMenuComponent dialog.");
		dialogRef.afterClosed().subscribe((result: TaskNode) => {
			if (result == null) {
				console.log("No edits were made to the task.");
			}
			else {
				this.database.updateDatabase();
				console.log("Edits were made to task + " + result.name);
			}
		});
	}

	deleteTaskButtonClicked(task: FlatTaskNode) {
		console.log("Delete task button clicked.");
		const dialogRef = this.dialog.open(ConfirmComponent, {
			data: "you want to delete this task?"
		});
		console.log("Open ConfirmComponent dialog.");
		dialogRef.afterClosed().subscribe((result) => {
			if (result == true) {
				this.deleteTask(task);
			}
		});
	}

	deleteTask(task: FlatTaskNode) {
		console.log("Deleting task " + task.name);
		this.database.deleteTask(this.flatTaskMap.get(task));
	}

	taskStatusChanged(event, task: FlatTaskNode) {
		console.log("Task status of task changed:", task);
		setTimeout(() => {
			if (task.repeat.preset == "none") {
				this.deleteTask(task);
			}
			else {
				console.log("Handling repetition of task", task);
				task.nextRepeat();
				this.database.updateDatabase();
				event.source.checked = false;
			}
		}, 500);
	}

	taskExpansionHandler(task: FlatTaskNode) {
		this.database.taskExpansionHandler(this.flatTaskMap.get(task));
	}

	getLevel = (flatTaskNode: FlatTaskNode) => flatTaskNode.level;
	isExpandable = (flatTaskNode: FlatTaskNode) => flatTaskNode.expandable;
	getChildren = (taskNode: TaskNode): Observable<TaskNode[]> => of(taskNode.tasks);
	hasChild = (_: number, flatTaskNode: FlatTaskNode) => flatTaskNode.expandable;
	hasNoContent = (_: number, _taskData: FlatTaskNode) => _taskData.name === "";

	flatTaskMap = new Map<FlatTaskNode, TaskNode>();
	nestedTaskMap = new Map<TaskNode, FlatTaskNode>();
	selectedParent: FlatTaskNode | null = null;
	newItemName = "";

	treeControl: FlatTreeControl<FlatTaskNode>;
	treeFlattener: MatTreeFlattener<TaskNode, FlatTaskNode>;
	dataSource: MatTreeFlatDataSource<TaskNode, FlatTaskNode>;

	listSelection = new SelectionModel<FlatTaskNode>(true);

	dragTask: any;
	dragTaskExpandOverTask: any;
	dragExpandOverWaitTimeMs = 300;
	dragExpandOverTime: number;
	dragTaskExpandOverArea: number;

	@ViewChild("emptyItem") emptyItem: ElementRef;

	project: any;
	projectId: number;
	projectPath: string;

	database: TaskDatabase;
}
