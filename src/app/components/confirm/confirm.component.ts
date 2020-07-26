import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
	selector: "app-confirm",
	templateUrl: "./confirm.component.html",
	styleUrls: [
		"./confirm.component.scss"
	]
})
export class ConfirmComponent implements OnInit {
	constructor(public dialogRef: MatDialogRef<ConfirmComponent>, @Inject(MAT_DIALOG_DATA) public content: string) {}

	ngOnInit(): void {}
	yesButtonClicked() {
		console.log("Yes button clicked.");
		this.dialogRef.close(true);
	}

	noButtonClicked() {
		console.log("No button clicked.");
		this.dialogRef.close(false);
	}
}
