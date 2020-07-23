import { Injectable } from "@angular/core";
import { TaskNode } from "../models/task-node";
import { FlatTaskNode } from "../models/flat-task-node";
import { AlgorithmsService } from "./algorithms.service";

@Injectable({
	providedIn: "root"
})
export class DateHandlerService {
	constructor(private algorithmsService: AlgorithmsService) {}

	handleRepeatedTaskDeletion(task: FlatTaskNode) {
		var currentDateDay = task.date.getDay();

		if (task.repeat.category == "days") {
			if (task.repeat.unit.indexOf(currentDateDay) == task.repeat.unit.length - 1) {
				task.date.setDate(task.date.getDate() + 7 * task.repeat.ordinal);
				console.log(task.date.toLocaleString());
			}

			task.date.setDate(
				task.date.getDate() +
					(this.algorithmsService.getArrayElementWithOverflowHandling(
						task.repeat.unit,
						task.repeat.unit.indexOf(currentDateDay) + 1
					) -
						currentDateDay)
			);
		}
		else if (task.repeat.category == "months") {
			if (task.repeat.unit.indexOf(currentDateDay) == task.repeat.unit.length - 1) {
				task.date.setFullYear(task.date.getFullYear() + 1 * task.repeat.ordinal);
			}

			task.date.setMonth(
				this.algorithmsService.getArrayElementWithOverflowHandling(
					task.repeat.unit,
					task.repeat.unit.indexOf(currentDateDay) + 1
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

	generateDateOutput(input: Date): string {
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
			return "empty";
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
			return "default";
		}
	}
}
