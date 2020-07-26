import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
	providedIn: "root"
})
export class ThemeService {
	constructor() {}

	set(theme: string) {
		this.setEvent.next(theme);
	}

	setEvent: Subject<string> = new Subject<string>();
	themes = {
		light: [
			"Deep Purple & Amber",
			"Indigo & Pink"
		],
		dark: [
			"Pink & Blue-gray",
			"Purple & Green"
		]
	};
	themeMap2: Map<string, string> = new Map([
		[
			"Deep Purple & Amber",
			"deeppurple-amber"
		],
		[
			"Indigo & Pink",
			"indigo-pink"
		],
		[
			"Pink & Blue-gray",
			"pink-bluegrey-dark"
		],
		[
			"Purple & Green",
			"purple-green-dark"
		]
	]);
}
