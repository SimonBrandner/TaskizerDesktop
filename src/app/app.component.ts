import { Component } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: [
		"./app.component.css"
	]
})
export class AppComponent {
	title = "taskizer";
	constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
		matIconRegistry.addSvgIcon(
			"taskizer",
			domSanitizer.bypassSecurityTrustResourceUrl("../assets/Icon_task_circle.svg")
		);
	}
}
