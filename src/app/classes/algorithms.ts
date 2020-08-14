import { TaskNode } from "./task-node";

export class Algorithms {
	constructor() {}

	static findLowestUnusedValueInNumberArray(array: Array<number>): number {
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

	static findAllTaskIdsInProject(task: any): Array<number> {
		var ids: Array<number> = [];

		if (task.id != undefined) {
			ids.push(task.id);
		}

		if (task.hasOwnProperty("tasks")) {
			task.tasks.forEach((subtask) => {
				ids = ids.concat(this.findAllTaskIdsInProject(subtask));
			});
		}

		return ids;
	}

	static getArrayElementWithOverflowHandling(array: Array<any>, index: number): any {
		if (index > array.length - 1) {
			return array[index - array.length];
		}
		else {
			return array[index];
		}
	}
}
