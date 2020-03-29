import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
	selector: "app-confirm",
	templateUrl: "./confirm.component.html",
	styleUrls: [
		"./confirm.component.css"
	]
})
export class ConfirmComponent implements OnInit {
	constructor(public dialogRef: MatDialogRef<ConfirmComponent>, @Inject(MAT_DIALOG_DATA) public content: string) {}

	ngOnInit(): void {}
	yesButtonClicked() {
		this.dialogRef.close(true);
	}

	noButtonClicked() {
		this.dialogRef.close(false);
	}
}
