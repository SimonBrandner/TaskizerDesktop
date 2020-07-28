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
			"Purple & Green",
			"Arc Dark"
		]
	};
	themeMap: Map<string, string> = new Map([
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
			"pink-bluegrey"
		],
		[
			"Purple & Green",
			"purple-green"
		],
		[
			"Arc Dark",
			"arc-dark"
		]
	]);
}
