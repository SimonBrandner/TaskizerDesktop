import { Component, OnInit, ViewChild, ElementRef, EventEmitter } from "@angular/core";
import { ConfigService } from "../../services/config.service";
import { ProjectService } from "../../services/project.service";
import { ActivatedRoute } from "@angular/router";
import { AlgorithmsService } from "../../services/algorithms.service";
import { MatTreeFlatDataSource, MatTreeFlattener } from "@angular/material/tree";
import { FlatTreeControl } from "@angular/cdk/tree";
import { Observable, of } from "rxjs";
import { FlatTaskNode } from "../../models/flat-task-node";
import { TaskNode } from "../../models/task-node";
import { TaskDatabase } from "../../models/task-database";
import { SelectionModel } from "@angular/cdk/collections";
import { TaskService } from "../../services/task.service";
import { TaskMenuComponent } from "../task-menu/task-menu.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
	selector: "app-project",
	templateUrl: "./project.component.html",
	styleUrls: [
		"./project.component.css"
	]
})
export class ProjectComponent implements OnInit {
	constructor(
		route: ActivatedRoute,
		private configService: ConfigService,
		private projectService: ProjectService,
		private algorithmsService: AlgorithmsService,
		private taskService: TaskService,
		public dialog: MatDialog
	) {
		this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
		this.treeControl = new FlatTreeControl<FlatTaskNode>(this.getLevel, this.isExpandable);
		this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

		route.params.subscribe((params) => {
			console.log("Switched to project with id: " + params["id"]);
			this.projectId = params["id"];
			configService.getProjectById(this.projectId).then((result) => {
				this.projectPath = result["path"];
				console.log("Retrieved project path from ConfigService.");
				console.log("The project path is: " + this.projectPath);
				projectService.getProjectByPath(this.projectPath).then((result) => {
					console.log("Retrieved project " + result["name"] + " from ProjectService.");
					this.database = new TaskDatabase(result);
					this.database.dataChange.subscribe((data) => {
						console.log("Data in database changed.");
						this.dataSource.data = [];
						this.dataSource.data = data;
						projectService.setProjectContent(this.projectPath, this.database.getProjectJSON());
						this.nestedTaskMap.forEach((element) => {
							element.isExpanded ? this.treeControl.expand(element) : this.treeControl.collapse(element);
						});
					});
				});
			});
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
		this.flatTaskMap.set(flatTask, task);
		this.nestedTaskMap.set(task, flatTask);
		return flatTask;
	};

	addTask(task: TaskNode) {
		this.database.addTask(task);
	}

	editTask(task: FlatTaskNode) {
		console.log("Edit task button clicked.");
		const dialogRef = this.dialog.open(TaskMenuComponent, {
			data: this.flatTaskMap.get(task)
		});
		console.log("Opened TaskMenuComponent dialog.");
		dialogRef.afterClosed().subscribe((result: TaskNode) => {
			if (result == null) {
				console.log("Nothing changed.");
			}
			else {
				this.database.updateDatabase();
			}
		});
	}

	deleteTask(task: FlatTaskNode) {
		this.database.deleteTask(this.flatTaskMap.get(task));
	}

	generateDateOutput(input: Date): string {
		console.log("Generating date output.");
		var weekDays: string[] = [
			"sunday",
			"monday",
			"tuesday",
			"wednesday",
			"thursday",
			"friday",
			"saturday"
		];
		var currentDate: Date = new Date();

		if (input == undefined) {
			return undefined;
		}
		else if (
			input.getMonth() == currentDate.getMonth() &&
			input.getFullYear() == currentDate.getFullYear() &&
			input.getDate() == currentDate.getDate()
		) {
			return "today";
		}
		else if (
			new Date(input.getFullYear(), input.getMonth(), input.getDate(), 0, 0, 0, 0).getTime() -
				new Date(
					currentDate.getFullYear(),
					currentDate.getMonth(),
					currentDate.getDate(),
					0,
					0,
					0,
					0
				).getTime() ==
			1000 * 60 * 60 * 24
		) {
			return "tomorrow";
		}
		else if (
			new Date(input.getFullYear(), input.getMonth(), input.getDate(), 0, 0, 0, 0).getTime() -
				new Date(
					currentDate.getFullYear(),
					currentDate.getMonth(),
					currentDate.getDate(),
					0,
					0,
					0,
					0
				).getTime() >
				0 &&
			new Date(input.getFullYear(), input.getMonth(), input.getDate(), 0, 0, 0, 0).getTime() -
				new Date(
					currentDate.getFullYear(),
					currentDate.getMonth(),
					currentDate.getDate(),
					0,
					0,
					0,
					0
				).getTime() <
				1000 * 60 * 60 * 24 * 7
		) {
			return weekDays[input.getDay().toString()];
		}
		else {
			return undefined;
		}
	}

	taskStatusChanged(task: FlatTaskNode) {
		setTimeout(() => {
			this.deleteTask(task);
		}, 500);
	}

	taskExpansionHandler(task: FlatTaskNode) {
		this.database.taskExpansionHandler(this.flatTaskMap.get(task));
	}

	handleDragStart(event, task) {
		// Required by Firefox (https://stackoverflow.com/questions/19055264/why-doesnt-html5-drag-and-drop-work-in-firefox)
		event.dataTransfer.setData("foo", "bar");
		//event.dataTransfer.setDragImage(this.emptyItem.nativeElement, 0, 0);
		this.dragTask = task;
		this.treeControl.collapse(task);
	}

	handleDragOver(event, task) {
		event.preventDefault();
		// Handle node expand
		if (this.dragTaskExpandOverTask && task === this.dragTaskExpandOverTask) {
			if (Date.now() - this.dragExpandOverTime > this.dragExpandOverWaitTimeMs) {
				if (!this.treeControl.isExpanded(task)) {
					this.treeControl.expand(task);
					//this.cd.detectChanges();
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

	handleDrop(event, task) {
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

	ngOnInit(): void {
		this.taskService.addTaskEvent.subscribe((result) => this.addTask(result));
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
