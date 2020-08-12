export class TaskNode {
	name: string;
	tasks: TaskNode[];
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

	setDateBasedOnRepeatRules() {
		var currentDeadline = this.date;
		var currentDate = new Date();
		currentDate.setHours(12);
		currentDate.setMinutes(0);
		currentDate.setSeconds(0);
		currentDate.setMilliseconds(0);

		if (this.repeat.category == "days") {
			if (currentDeadline && this.repeat.unit.includes(currentDeadline.getDay())) {
				this.date = currentDeadline;
				return;
			}

			for (var element of this.repeat.unit) {
				if (element >= currentDate.getDay()) {
					currentDate.setDate(currentDate.getDate() + (element - currentDate.getDay()));
					this.date = currentDate;
					return;
				}
			}

			currentDate.setDate(
				currentDate.getDate() + 7 + (this.repeat.unit[this.repeat.unit.length - 1] - currentDate.getDay())
			);
			this.date = currentDate;
			return;
		}
		else if (this.repeat.category == "months") {
			if (currentDeadline && this.repeat.unit.includes(currentDeadline.getMonth())) {
				this.date = currentDeadline;
				return;
			}

			for (var element of this.repeat.unit) {
				if (element >= currentDate.getMonth()) {
					currentDate.setMonth(element);
					this.date = currentDate;
					return;
				}
			}

			currentDate.setMonth(
				currentDate.getMonth() + 12 + (this.repeat.unit[this.repeat.unit.length - 1] - currentDate.getMonth())
			);
			this.date = currentDate;
			return;
		}
		else {
			if (currentDeadline) {
				this.date = currentDeadline;
				return;
			}
			else {
				this.date = currentDate;
				return;
			}
		}
	}
}
