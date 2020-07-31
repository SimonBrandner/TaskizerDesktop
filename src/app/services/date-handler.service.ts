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

	handleRepeatedTaskDeletion(task: FlatTaskNode) {
		var currentDateDay = task.date.getDay();
		var currentDateMonth = task.date.getMonth();

		if (task.repeat.category == "days") {
			if (task.repeat.unit.indexOf(currentDateDay) == task.repeat.unit.length - 1) {
				task.date.setDate(task.date.getDate() + 7 * task.repeat.ordinal);
				console.log(task.date.toLocaleString());
			}

			task.date.setDate(
				task.date.getDate() +
					(Algorithms.getArrayElementWithOverflowHandling(
						task.repeat.unit,
						task.repeat.unit.indexOf(currentDateDay) + 1
					) -
						currentDateDay)
			);
		}
		else if (task.repeat.category == "months") {
			if (task.repeat.unit.indexOf(currentDateMonth) == task.repeat.unit.length - 1) {
				task.date.setFullYear(task.date.getFullYear() + 1 * task.repeat.ordinal);
			}

			task.date.setMonth(
				Algorithms.getArrayElementWithOverflowHandling(
					task.repeat.unit,
					task.repeat.unit.indexOf(currentDateMonth) + 1
				)
			);
		}
		else {
			if (task.repeat.unit[0] == 0) {
				// Day
				task.date.setDate(task.date.getDate() + 1 * task.repeat.ordinal);
				console.log("test");
			}
			else if (task.repeat.unit[0] == 1) {
				// Week
				task.date.setDate(task.date.getDate() + 7 * task.repeat.ordinal);
			}
			else if (task.repeat.unit[0] == 2) {
				// Month
				task.date.setMonth(task.date.getMonth() + 1 * task.repeat.ordinal);
			}
			else {
				// Year
				task.date.setFullYear(task.date.getFullYear() + 1 * task.repeat.ordinal);
			}
		}
	}
}
