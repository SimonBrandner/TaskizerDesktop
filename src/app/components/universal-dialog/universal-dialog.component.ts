import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
	selector: "error",
	templateUrl: "./universal-dialog.component.html",
	styleUrls: [
		"./universal-dialog.component.html"
	]
})
export class UniversalDialogComponent implements OnInit {
	constructor(
		public dialogRef: MatDialogRef<UniversalDialogComponent>,
		public dialog: MatDialog,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {}

	ngOnInit(): void {}
}
