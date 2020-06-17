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

const TEST_DATA = {
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

@Component({
	selector: "app-project",
	templateUrl: "./project.component.html",
	styleUrls: [
		"./project.component.css"
	],
	providers: [
		TaskDatabase
	]
})
export class ProjectComponent implements OnInit {
	constructor(
		route: ActivatedRoute,
		configService: ConfigService,
		projectService: ProjectService,
		algorithmsService: AlgorithmsService,
		private database: TaskDatabase
	) {
		this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
		this.treeControl = new FlatTreeControl<FlatTaskNode>(this.getLevel, this.isExpandable);
		this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

		database.dataChange.subscribe((data) => {
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
		const existingNode = this.nestedTaskMap.get(task);
		const flatNode = existingNode && existingNode.name === task.name ? existingNode : new FlatTaskNode();
		flatNode.name = task.name;
		flatNode.level = level;
		flatNode.expandable = task.tasks && task.tasks.length > 0;
		this.flatTaskMap.set(flatNode, task);
		this.nestedTaskMap.set(task, flatNode);
		return flatNode;
	};

	getLevel = (flatTaskNode: FlatTaskNode) => flatTaskNode.level;
	isExpandable = (flatTaskNode: FlatTaskNode) => flatTaskNode.expandable;
	getChildren = (taskNode: TaskNode): Observable<TaskNode[]> => of(taskNode.tasks);
	hasChild = (_: number, flatTaskNode: FlatTaskNode) => flatTaskNode.expandable;
	hasNoContent = (_: number, _nodeData: FlatTaskNode) => _nodeData.name === "";

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
	dragNodeExpandOverWaitTimeMs = 300;
	dragNodeExpandOverNode: any;
	dragNodeExpandOverTime: number;
	dragNodeExpandOverArea: number;

	@ViewChild("emptyItem") emptyItem: ElementRef;

	project: any;
	projectId: number;
	projectPath: string;
}
