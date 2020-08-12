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
	reminders: Array<Date>;
	id: number;

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

	nextRepeat() {
		// Date
		var currentDateDay = this.date.getDay();
		var currentDateMonth = this.date.getMonth();

		if (this.repeat.category == "days") {
			if (this.repeat.unit.indexOf(currentDateDay) == this.repeat.unit.length - 1) {
				this.date.setDate(this.date.getDate() + 7 * this.repeat.ordinal);
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
		// Date

		// Reminders
		this.reminders.forEach((reminder, index) => {
			var currentDateDay = reminder.getDay();
			var currentDateMonth = reminder.getMonth();

			if (this.repeat.category == "days") {
				if (this.repeat.unit.indexOf(currentDateDay) == this.repeat.unit.length - 1) {
					this.reminders[index].setDate(reminder.getDate() + 7 * this.repeat.ordinal);
				}

				this.reminders[index].setDate(
					reminder.getDate() +
						(Algorithms.getArrayElementWithOverflowHandling(
							this.repeat.unit,
							this.repeat.unit.indexOf(currentDateDay) + 1
						) -
							currentDateDay)
				);
			}
			else if (this.repeat.category == "months") {
				if (this.repeat.unit.indexOf(currentDateMonth) == this.repeat.unit.length - 1) {
					this.reminders[index].setFullYear(reminder.getFullYear() + 1 * this.repeat.ordinal);
				}

				this.reminders[index].setMonth(
					Algorithms.getArrayElementWithOverflowHandling(
						this.repeat.unit,
						this.repeat.unit.indexOf(currentDateMonth) + 1
					)
				);
			}
			else {
				if (this.repeat.unit[0] == 0) {
					// Day
					this.reminders[index].setDate(reminder.getDate() + 1 * this.repeat.ordinal);
					console.log("test");
				}
				else if (this.repeat.unit[0] == 1) {
					// Week
					this.reminders[index].setDate(reminder.getDate() + 7 * this.repeat.ordinal);
				}
				else if (this.repeat.unit[0] == 2) {
					// Month
					this.reminders[index].setMonth(reminder.getMonth() + 1 * this.repeat.ordinal);
				}
				else {
					// Year
					this.reminders[index].setFullYear(reminder.getFullYear() + 1 * this.repeat.ordinal);
				}
			}
		});
		// Reminders
	}
}
