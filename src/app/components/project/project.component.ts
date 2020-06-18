import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ConfigService } from "../../services/config.service";
import { ProjectService } from "../../services/project.service";
import { ActivatedRoute } from "@angular/router";
import { AlgorithmsService } from "../../services/algorithms.service";
import { CdkDragDrop, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { MatTreeFlatDataSource, MatTreeFlattener } from "@angular/material/tree";
import { FlatTreeControl } from "@angular/cdk/tree";
import { BehaviorSubject, Observable, of, from } from "rxjs";
import { FlatTaskNode } from "../../models/flat-task-node";
import { TaskNode } from "../../models/task-node";
import { TaskDatabase } from "../../models/task-database";
import { SelectionModel } from "@angular/cdk/collections";

const TEST_DATA1 = {
	name: "New project 0",
	tasks: [
		{
			id: 0,
			name: "Hello world 0",
			tasks: [
				{
					id: 1,
					name: "Hello world 1",
					tasks: [
						{
							id: 2,
							name: "Hello world 2",
							expanded: true,
							tasks: [
								{
									id: 3,
									name: "Hello world 3",
									expanded: false
								},
								{
									id: 8,
									name: "Hello world 8",
									expanded: false
								}
							]
						},
						{
							id: 9,
							name: "Hello world 9",
							tasks: [
								{
									id: 10,
									name: "Hello world 10",
									expanded: false
								},
								{
									id: 11,
									name: "Hello world 11"
								}
							]
						}
					]
				}
			]
		},
		{
			id: 4,
			name: "Hello world 4",
			tasks: [
				{
					id: 5,
					name: "Hello world 5",
					tasks: [
						{
							id: 6,
							name: "Hello world 6",
							tasks: [
								{
									id: 7,
									name: "Hello world 7"
								}
							]
						}
					]
				}
			]
		}
	]
};

const TEST_DATA2 = {
	Groceries: {
		"Almond Meal flour": null,
		"Organic eggs": null,
		"Protein Powder": null,
		Fruits: {
			Apple: null,
			Berries: [
				"Blueberry",
				"Raspberry"
			],
			Orange: null
		}
	},
	Reminders: [
		"Cook dinner",
		"Read the Material Design spec",
		"Upgrade Application to Angular"
	]
};

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
		configService: ConfigService,
		projectService: ProjectService,
		algorithmsService: AlgorithmsService
	) {
		this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
		this.treeControl = new FlatTreeControl<FlatTaskNode>(this.getLevel, this.isExpandable);
		this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

		this.database = new TaskDatabase(TEST_DATA2);

		this.database.dataChange.subscribe((data) => {
			this.dataSource.data = [];
			this.dataSource.data = data;
		});

		/*
		route.params.subscribe((params) => {
			console.log("Switched to project with id: " + params["id"]);
			this.projectId = params["id"];
			configService.getProjectById(this.projectId).then((result) => {
				this.projectPath = result["path"];
				console.log("Retrieved project path from ConfigService.");
				console.log("The project path is: " + this.projectPath);
				projectService.getProjectByPath(this.projectPath).then((result) => {
					this.project = result;
					console.log("Retrieved project " + this.project.name + " from ProjectService.");
					this.taskIds = algorithmsService.findAllTaskIdsInProject(this.project, this.topLevelId);
					console.log("Retrieved all task ids from AlgorithmsService" + this.taskIds);
				});
			});
		});
		*/
	}

	transformer = (task: TaskNode, level: number) => {
		const existingTask = this.nestedTaskMap.get(task);
		const flatTask = existingTask && existingTask.name === task.name ? existingTask : new FlatTaskNode();
		flatTask.name = task.name;
		flatTask.level = level;
		flatTask.expandable = task.tasks && task.tasks.length > 0;
		this.flatTaskMap.set(flatTask, task);
		this.nestedTaskMap.set(task, flatTask);
		return flatTask;
	};

	deleteTask(task: FlatTaskNode) {
		this.database.deleteTask(this.flatTaskMap.get(task));
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
			let newItem: TaskNode;
			if (this.dragTaskExpandOverArea === 1) {
				newItem = this.database.copyPasteTaskAbove(
					this.flatTaskMap.get(this.dragTask),
					this.flatTaskMap.get(task)
				);
			}
			else if (this.dragTaskExpandOverArea === -1) {
				newItem = this.database.copyPasteTaskBelow(
					this.flatTaskMap.get(this.dragTask),
					this.flatTaskMap.get(task)
				);
			}
			else {
				newItem = this.database.copyPasteSubtask(
					this.flatTaskMap.get(this.dragTask),
					this.flatTaskMap.get(task)
				);
			}
			this.database.deleteTask(this.flatTaskMap.get(this.dragTask));
			this.treeControl.expandDescendants(this.nestedTaskMap.get(newItem));
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

	getLevel = (flatTaskNode: FlatTaskNode) => flatTaskNode.level;
	isExpandable = (flatTaskNode: FlatTaskNode) => flatTaskNode.expandable;
	getChildren = (taskNode: TaskNode): Observable<TaskNode[]> => of(taskNode.tasks);
	hasChild = (_: number, flatTaskNode: FlatTaskNode) => flatTaskNode.expandable;
	hasNoContent = (_: number, _taskData: FlatTaskNode) => _taskData.name === "";

	ngOnInit(): void {}

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
