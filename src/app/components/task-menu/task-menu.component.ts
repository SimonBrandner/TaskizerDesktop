import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DialogService } from "../../services/dialog.service";
import { ConfigService } from "../../services/config.service";
import { ProjectService } from "../../services/project.service";
import { TaskNode } from "src/app/classes/task-node";
import { FormControl } from "@angular/forms";
import { ReplaySubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
	selector: "task-menu",
	templateUrl: "./task-menu.component.html",
	styleUrls: [
		"./task-menu.component.scss"
	]
})
export class TaskMenuComponent implements OnInit, OnDestroy {
	constructor(
		public dialogRef: MatDialogRef<TaskMenuComponent>,
		private dialogService: DialogService,
		private projectService: ProjectService,
		private configService: ConfigService,
		@Inject(MAT_DIALOG_DATA) public data: TaskNode,
		public dialog: MatDialog
	) {
		data.repeat.unit.forEach((element) => {
			this.unitInput.push(data.repeat.category + "." + element);
		});
	}

	ngOnInit(): void {
		this.filteredUnits.next(this.copyUnitCategories(this.unitCategories));

		this.unitCategoriesFilterControl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
			this.filterUnitCategories();
		});
	}

	ngOnDestroy() {
		this._onDestroy.next();
		this._onDestroy.complete();
	}

	saveButtonClicked(): void {
		console.log("Save button clicked.");
		this.dialogRef.close(this.data);
	}

	clearDateInput() {
		console.log("Clear date input button clicked.");
		this.data.date = undefined;
		this.data.repeat.ordinal = undefined;
		this.data.repeat.unit = [];
		this.data.repeat.category = undefined;
		this.data.repeat.preset = "none";
		this.unitInput = [];
	}

	deadlineChanged() {
		this.data.repeat.ordinal = undefined;
		this.data.repeat.unit = [];
		this.data.repeat.category = undefined;
		this.unitInput = [];
		this.data.repeat.preset = "none";
	}

	presetSelectionChanged() {
		if (this.data.repeat.preset == "none") {
			this.data.repeat.ordinal = undefined;
			this.data.repeat.unit = [];
			this.data.repeat.category = undefined;
			this.unitInput = [];
		}
	}

	unitSelectionChanged() {
		if (!this.unitInput || !this.unitInput.length) {
			return;
		}
		this.data.repeat.category = this.unitInput[0].slice(0, this.unitInput[0].indexOf("."));
		this.unitInput.forEach((element, index) => {
			this.data.repeat.unit[index] = +element.slice(element.indexOf(".") + 1, element.length);
		});

		this.data.setDateBasedOnRepeatRules();
	}

	filterUnitCategories() {
		let searchInput = this.unitCategoriesFilterControl.value;
		const units = this.copyUnitCategories(this.unitCategories);
		if (!searchInput) {
			this.filteredUnits.next(units);
			return;
		}
		else {
			searchInput = searchInput.toLowerCase();
		}
		this.filteredUnits.next(
			units.filter((category) => {
				const showCategory = category.name.toLowerCase().indexOf(searchInput) > -1;
				if (!showCategory) {
					category.units = category.units.filter((unit) => unit.name.toLowerCase().indexOf(searchInput) > -1);
				}
				return category.units.length > 0;
			})
		);
	}

	copyUnitCategories(unitCategories) {
		let unitCategoriesCopy = [];
		unitCategories.forEach((category) => {
			unitCategoriesCopy.push({
				name: category.name,
				units: category.units.slice()
			});
		});
		return unitCategoriesCopy;
	}

	unitInput: Array<string> = [];

	_onDestroy = new Subject<void>();

	unitCategoriesFilterControl: FormControl = new FormControl();
	filteredUnits: ReplaySubject<Array<any>> = new ReplaySubject<any>(1);
	unitCategories: Array<any> = [
		{
			name: "Units",
			units: [
				{
					name: "Day",
					id: "units.0"
				},
				{
					name: "Week",
					id: "units.1"
				},
				{
					name: "Month",
					id: "units.2"
				},
				{
					name: "Year",
					id: "units.3"
				}
			]
		},
		{
			name: "Days",
			units: [
				{
					name: "Sunday",
					id: "days.0"
				},
				{
					name: "Monday",
					id: "days.1"
				},
				{
					name: "Tuesday",
					id: "days.2"
				},
				{
					name: "Wednesday",
					id: "days.3"
				},
				{
					name: "Thursday",
					id: "days.4"
				},
				{
					name: "Friday",
					id: "days.5"
				},
				{
					name: "Saturday",
					id: "days.6"
				}
			]
		},
		{
			name: "Months",
			units: [
				{
					name: "January",
					id: "months.0"
				},
				{
					name: "February",
					id: "months.1"
				},
				{
					name: "March",
					id: "months.2"
				},
				{
					name: "April",
					id: "months.3"
				},
				{
					name: "May",
					id: "months.4"
				},
				{
					name: "June",
					id: "months.5"
				},
				{
					name: "July",
					id: "months.6"
				},
				{
					name: "August",
					id: "months.7"
				},
				{
					name: "September",
					id: "months.8"
				},
				{
					name: "October",
					id: "months.9"
				},
				{
					name: "November",
					id: "months.10"
				},
				{
					name: "December",
					id: "months.11"
				}
			]
		}
	];
}
