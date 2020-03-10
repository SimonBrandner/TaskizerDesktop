import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Components
import { TodayComponent } from "./components/today/today.component";
import { CalenderComponent } from "./components/calender/calender.component";
import { ProjectComponent } from "./components/project/project.component";
// Components

const routes: Routes = [
	{ path: "", pathMatch: "full", redirectTo: "today" },
	{ path: "today", component: TodayComponent },
	{ path: "calender", component: CalenderComponent },
	{ path: "project/:id", component: ProjectComponent }
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes)
	],
	exports: [
		RouterModule
	]
})
export class AppRoutingModule {}
