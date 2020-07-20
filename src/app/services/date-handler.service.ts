import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root"
})
export class DateHandlerService {
	constructor() {}

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
