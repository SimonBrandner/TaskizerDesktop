import { Injectable } from "@angular/core";
import { isDataSource } from "@angular/cdk/collections";

@Injectable({
	providedIn: "root"
})
export class AlgorithmsService {
	constructor() {}

	findLowestUnusedValueInNumberArray(array: Array<number>): number {
		var indexUpper: number = 0;
		var index: number = 0;

		for (let projectIdUpper of array) {
			if (indexUpper != projectIdUpper) {
				for (let projectId of array) {
					if (projectId == indexUpper) {
						index = 0;
						break;
					}
					if (index == array.length - 1) {
						return indexUpper;
					}
					index++;
				}
			}
			indexUpper++;
		}
		return array.length;
	}

	findAllTaskIdsInProject(project, topLevelId: String): Array<String> {
		var ids: String[] = [];
		var task = project;

		if (task.hasOwnProperty("tasks")) {
			if (task.hasOwnProperty("id")) {
				ids.push(task.id.toString());
			}
			else {
				ids.push(topLevelId);
			}

			task.tasks.forEach((subtask) => {
				ids = ids.concat(this.findAllTaskIdsInProject(subtask, topLevelId));
			});

			return ids;
		}
		else {
			return [];
		}
	}
}
