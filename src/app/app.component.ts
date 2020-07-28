import { Component, OnInit, HostBinding } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { ThemeService } from "./services/theme.service";
import { ConfigService } from "./services/config.service";
import { OverlayContainer } from "@angular/cdk/overlay";

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
		private configService: ConfigService,
		public overlayContainer: OverlayContainer
	) {
		matIconRegistry.addSvgIcon("taskizer", domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/icon.svg"));
		this.configService.get().then((result) => {
			this.setTheme(result["theme"]);
		});
	}

	ngOnInit() {
		this.themeService.setEvent.subscribe((result) => this.setTheme(result));
	}

	setTheme(theme: string) {
		theme = this.themeService.themeMap.get(theme);
		this.currentTheme = theme;
		var classList = this.overlayContainer.getContainerElement().classList;

		if (classList.contains(this.activeThemeCssClass)) {
			classList.replace(this.activeThemeCssClass, theme);
		}
		else {
			classList.add(theme);
		}
		console.log("Setting theme to " + theme);
		this.activeThemeCssClass = theme;
	}

	@HostBinding("class") activeThemeCssClass: string;
	currentTheme = "deeppurple-amber";
}
