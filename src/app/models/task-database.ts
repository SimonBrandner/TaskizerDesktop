import { SelectionModel } from "@angular/cdk/collections";
import { FlatTreeControl } from "@angular/cdk/tree";
import { Component, Injectable, ElementRef, ViewChild } from "@angular/core";
import { MatTreeFlatDataSource, MatTreeFlattener } from "@angular/material/tree";
import { BehaviorSubject, from } from "rxjs";
import { TaskNode } from "./task-node";

@Injectable()
export class TaskDatabase {
	dataChange = new BehaviorSubject<TaskNode[]>([]);
}
