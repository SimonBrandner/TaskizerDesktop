import { Injectable } from "@angular/core";
import { TaskNode } from "../classes/task-node";
import { FlatTaskNode } from "../classes/flat-task-node";
import { Algorithms } from "../classes/algorithms";

@Injectable({
	providedIn: "root"
})
export class DateHandlerService {
	constructor() {}

	getDateBasedOnRepeatRules(unit: Array<number>, category: string, currentDeadline: Date): Date {
		var currentDate = new Date();
		currentDate.setHours(12);
		currentDate.setMinutes(0);
		currentDate.setSeconds(0);
		currentDate.setMilliseconds(0);

		if (category == "days") {
			if (currentDeadline && unit.includes(currentDeadline.getDay())) {
				return currentDeadline;
			}

			for (var element of unit) {
				if (element >= currentDate.getDay()) {
					currentDate.setDate(currentDate.getDate() + (element - currentDate.getDay()));
					return currentDate;
				}
			}

			currentDate.setDate(currentDate.getDate() + 7 + (unit[unit.length - 1] - currentDate.getDay()));
			return currentDate;
		}
		else if (category == "months") {
			if (currentDeadline && unit.includes(currentDeadline.getMonth())) {
				return currentDeadline;
			}

			for (var element of unit) {
				if (element >= currentDate.getMonth()) {
					currentDate.setMonth(element);
					return currentDate;
				}
			}

			currentDate.setMonth(currentDate.getMonth() + 12 + (unit[unit.length - 1] - currentDate.getMonth()));
			return currentDate;
		}
		else {
			if (currentDeadline) {
				return currentDeadline;
			}
			else {
				return currentDate;
			}
		}
	}
}
