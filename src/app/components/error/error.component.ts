import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
	selector: "error",
	templateUrl: "./error.component.html",
	styleUrls: [
		"./error.component.scss"
	]
})
export class ErrorComponent implements OnInit {
	constructor(
		public dialogRef: MatDialogRef<ErrorComponent>,
		public dialog: MatDialog,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {}

	ngOnInit(): void {}
}
