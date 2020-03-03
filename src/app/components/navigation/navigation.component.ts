import { Component, OnInit } from "@angular/core";
import { BreakpointObserver, Breakpoints, BreakpointState } from "@angular/cdk/layout";
import { Observable } from "rxjs";

@Component({
	selector: "navigation",
	templateUrl: "./navigation.component.html",
	styleUrls: [
		"./navigation.component.css"
	]
})
export class NavigationComponent implements OnInit {
	isHandset: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.Handset);

	constructor(private breakpointObserver: BreakpointObserver) {}

	ngOnInit() {}
}
