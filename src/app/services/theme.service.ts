import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root"
})
export class ThemeService {
	constructor() {}

	set(theme: string) {
		this.setStyle("themeAsset", this.themeMap.get(theme));
	}

	setStyle(key: string, href: string) {
		this.getLinkElementForKey(key).setAttribute("href", href);
	}

	getLinkElementForKey(key: string) {
		return this.getExistingLinkElementByKey(key) || this.createLinkElementWithKey(key);
	}
	getExistingLinkElementByKey(key: string) {
		return document.head.querySelector(`link[rel="stylesheet"].${this.getClassNameForKey(key)}`);
	}
	createLinkElementWithKey(key: string) {
		const linkEl = document.createElement("link");
		linkEl.setAttribute("rel", "stylesheet");
		linkEl.setAttribute("type", "text/css");
		linkEl.classList.add(this.getClassNameForKey(key));
		document.head.appendChild(linkEl);
		return linkEl;
	}
	getClassNameForKey(key: string) {
		return `style-manager-${key}`;
	}

	themeMap: Map<string, string> = new Map([
		[
			"Deep Purple & Amber",
			"../node_modules/@angular/material/prebuilt-themes/deeppurple-amber.css"
		],
		[
			"Indigo & Pink",
			"../node_modules/@angular/material/prebuilt-themes/indigo-pink.css"
		],
		[
			"Pink & Blue-gray",
			"../node_modules/@angular/material/prebuilt-themes/pink-bluegrey.css"
		],
		[
			"Purple & Green",
			"../node_modules/@angular/material/prebuilt-themes/purple-green.css"
		]
	]);

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
}
