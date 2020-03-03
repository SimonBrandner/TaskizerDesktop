// Angular
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
// Angular

// Material
import { MatSidenavModule, MatSidenavContainer, MatDrawerContent } from "@angular/material/sidenav";
import { MatSliderModule } from "@angular/material/slider";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatButtonModule } from "@angular/material/button";
// Material

// App
import { AppRoutingModule } from "./app-routing.module";
// App

// Components
import { AppComponent } from "./app.component";
import { NavigationComponent } from "./components/navigation/navigation.component";
// Components

@NgModule({
	declarations: [
		AppComponent,
		NavigationComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatSliderModule,
		MatSidenavModule,
		MatToolbarModule,
		MatIconModule,
		MatListModule,
		MatButtonModule
	],
	providers: [],
	exports: [],
	bootstrap: [
		AppComponent
	]
})
export class AppModule {}
