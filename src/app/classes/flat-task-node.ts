import { Algorithms } from "./algorithms";

export class FlatTaskNode {
	name: string;
	level: number;
	expandable: boolean;
	isExpanded: boolean;
	date: Date;
	repeat: {
		preset: string;
		ordinal: number;
		unit: number[];
		category: string;
	};

	getDateOutput() {
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

		if (this.date == undefined) {
			return "empty";
		}
		else if (
			this.date.getMonth() == currentDate.getMonth() &&
			this.date.getFullYear() == currentDate.getFullYear() &&
			this.date.getDate() == currentDate.getDate()
		) {
			return "today";
		}
		else if (
			new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate(), 0, 0, 0, 0).getTime() -
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
			new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate(), 0, 0, 0, 0).getTime() -
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
			new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate(), 0, 0, 0, 0).getTime() -
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
			return weekDays[this.date.getDay().toString()];
		}
		else {
			return "default";
		}
	}

	nextRepeatDate() {
		var currentDateDay = this.date.getDay();
		var currentDateMonth = this.date.getMonth();

		if (this.repeat.category == "days") {
			if (this.repeat.unit.indexOf(currentDateDay) == this.repeat.unit.length - 1) {
				this.date.setDate(this.date.getDate() + 7 * this.repeat.ordinal);
				console.log(this.date.toLocaleString());
			}

			this.date.setDate(
				this.date.getDate() +
					(Algorithms.getArrayElementWithOverflowHandling(
						this.repeat.unit,
						this.repeat.unit.indexOf(currentDateDay) + 1
					) -
						currentDateDay)
			);
		}
		else if (this.repeat.category == "months") {
			if (this.repeat.unit.indexOf(currentDateMonth) == this.repeat.unit.length - 1) {
				this.date.setFullYear(this.date.getFullYear() + 1 * this.repeat.ordinal);
			}

			this.date.setMonth(
				Algorithms.getArrayElementWithOverflowHandling(
					this.repeat.unit,
					this.repeat.unit.indexOf(currentDateMonth) + 1
				)
			);
		}
		else {
			if (this.repeat.unit[0] == 0) {
				// Day
				this.date.setDate(this.date.getDate() + 1 * this.repeat.ordinal);
				console.log("test");
			}
			else if (this.repeat.unit[0] == 1) {
				// Week
				this.date.setDate(this.date.getDate() + 7 * this.repeat.ordinal);
			}
			else if (this.repeat.unit[0] == 2) {
				// Month
				this.date.setMonth(this.date.getMonth() + 1 * this.repeat.ordinal);
			}
			else {
				// Year
				this.date.setFullYear(this.date.getFullYear() + 1 * this.repeat.ordinal);
			}
		}
	}
}
