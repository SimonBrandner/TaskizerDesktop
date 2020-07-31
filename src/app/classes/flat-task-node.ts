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
}
