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
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
	selector: "app-project",
	templateUrl: "./project.component.html",
	styleUrls: [
		"./project.component.scss"
	]
})
export class ProjectComponent implements OnInit {
	constructor(
		private route: ActivatedRoute,
		private configService: ConfigService,
		private projectService: ProjectService,
		private taskService: TaskService,
		public dialog: MatDialog,
		private snackBar: MatSnackBar
	) {
		this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
		this.treeControl = new FlatTreeControl<FlatTaskNode>(this.getLevel, this.isExpandable);
		this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
	}

	ngOnInit(): void {
		this.taskService.addTaskEvent.subscribe((result) => this.addTask(result));

		this.route.params.subscribe((params) => {
			this.projectId = params["id"];
			console.log("Switched to project with id:", this.projectId);
			this.projectPath = this.configService.getProjectById(this.projectId)["path"];
			console.log("Retrieved project path from ConfigService", this.projectPath);
			this.projectService
				.getProjectByPath(this.projectPath)
				.then((result) => {
					console.log("Retrieved project ", result["name"], " from ProjectService.");
					this.database = new TaskDatabase(result["tasks"]);
					console.log("Pushed data from ProjectService to TaskDatabase.");
					this.database.dataChange.subscribe((data) => {
						console.log("Data in database changed.");
						this.dataSource.data = [];
						this.dataSource.data = data;
						this.projectService.setProjectContent(this.projectPath, this.database.getProjectJSON());
						console.log("Saved project using ProjectService.");
						this.nestedTaskMap.forEach((element) => {
							element.isExpanded ? this.treeControl.expand(element) : this.treeControl.collapse(element);
						});
					});
				})
				.catch(() => {});
		});
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

	addTask(task: TaskNode) {
		this.database.addTask(task);
		console.log("Added task " + task.name);
	}

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

		var databaseDataBackUp = new Array<TaskNode>();
		Object.assign(databaseDataBackUp, this.database.data);
		console.log("Created database back up: ", databaseDataBackUp);
		this.deleteTaskFromDatabase(task);

		console.log("Opening SnackBar.");
		var snackBarRef = this.snackBar.open("Task " + task.name + " deleted!", "Undo", {
			duration: 5000
		});

		snackBarRef.onAction().subscribe(() => {
			console.log("Undo clicked");
			this.database.dataChange.next(databaseDataBackUp);
		});
	}

	deleteTaskFromDatabase(task: FlatTaskNode) {
		console.log("Deleting task from database", task.name);
		this.database.deleteTask(this.flatTaskMap.get(task));
	}

	taskStatusChanged(event, task: FlatTaskNode) {
		console.log("Task status of task changed:", task);
		setTimeout(() => {
			if (task.repeat.preset == "none") {
				var databaseDataBackUp = new Array<TaskNode>();
				Object.assign(databaseDataBackUp, this.database.data);
				console.log("Created database back up: ", databaseDataBackUp);
				this.deleteTaskFromDatabase(task);

				console.log("Opening SnackBar.");
				var snackBarRef = this.snackBar.open("Task " + task.name + " completed!", "Undo", {
					duration: 5000
				});

				snackBarRef.onAction().subscribe(() => {
					console.log("Undo clicked");
					this.database.dataChange.next(databaseDataBackUp);
				});
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

	handleDragStart(event, task: FlatTaskNode) {
		console.log("Dragging started on task " + task.name);
		event.dataTransfer.setData("foo", "bar");
		//event.dataTransfer.setDragImage(this.emptyItem.nativeElement, 0, 0);
		this.dragTask = task;
		this.treeControl.collapse(task);
	}

	handleDragOver(event, task: FlatTaskNode) {
		console.log("Dragging over task " + task.name);
		event.preventDefault();
		// Handle node expand
		if (this.dragTaskExpandOverTask && task === this.dragTaskExpandOverTask) {
			if (Date.now() - this.dragExpandOverTime > this.dragExpandOverWaitTimeMs) {
				if (!this.treeControl.isExpanded(task)) {
					this.treeControl.expand(task);
				}
			}
		}
		else {
			this.dragTaskExpandOverTask = task;
			this.dragExpandOverTime = new Date().getTime();
		}

		// Handle drag area
		const percentageY = event.offsetY / event.target.clientHeight;
		if (0 <= percentageY && percentageY <= 0.25) {
			this.dragTaskExpandOverArea = 1;
		}
		else if (1 >= percentageY && percentageY >= 0.75) {
			this.dragTaskExpandOverArea = -1;
		}
		else {
			this.dragTaskExpandOverArea = 0;
		}
	}

	handleDrop(event, task: FlatTaskNode) {
		console.log("Dropped task " + task.name);
		if (task !== this.dragTask) {
			let newTask: TaskNode;
			if (this.dragTaskExpandOverArea === 1) {
				newTask = this.database.insertTaskAbove(
					this.flatTaskMap.get(this.dragTask),
					this.flatTaskMap.get(task)
				);
			}
			else if (this.dragTaskExpandOverArea === -1) {
				newTask = this.database.insertTaskBelow(
					this.flatTaskMap.get(this.dragTask),
					this.flatTaskMap.get(task)
				);
			}
			else {
				newTask = this.database.insertSubtask(this.flatTaskMap.get(this.dragTask), this.flatTaskMap.get(task));
			}
			this.database.deleteTask(this.flatTaskMap.get(this.dragTask));
			this.treeControl.expandDescendants(this.nestedTaskMap.get(newTask));
		}
		this.handleDragEnd(event);
	}

	handleDragEnd(event) {
		console.log("Dragging ended.");
		this.dragTask = null;
		this.dragTaskExpandOverTask = null;
		this.dragExpandOverTime = 0;
		this.dragTaskExpandOverArea = NaN;
		event.preventDefault();
	}

	getStyle(task: FlatTaskNode) {
		if (this.dragTask === task) {
			return "drag-start";
		}
		else if (this.dragTaskExpandOverTask === task) {
			switch (this.dragTaskExpandOverArea) {
				case 1:
					return "drop-above";
				case -1:
					return "drop-below";
				default:
					return "drop-center";
			}
		}
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
