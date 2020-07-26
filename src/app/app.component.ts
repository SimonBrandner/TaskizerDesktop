import { Component, OnInit } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { ThemeService } from "./services/theme.service";
import { ConfigService } from "./services/config.service";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: [
		"./app.component.scss"
	]
})
export class AppComponent implements OnInit {
	title = "taskizer";
	constructor(
		private matIconRegistry: MatIconRegistry,
		private domSanitizer: DomSanitizer,
		private themeService: ThemeService,
		private configService: ConfigService
	) {
		matIconRegistry.addSvgIcon("taskizer", domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/icon.svg"));
	}
	ngOnInit(): void {
		this.configService.get().then((result) => {
			this.themeService.set(result["theme"]);
			console.log("Setting theme to" + result["theme"]);
		});
	}
}
