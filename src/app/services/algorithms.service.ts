import { Injectable } from "@angular/core";

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
}
