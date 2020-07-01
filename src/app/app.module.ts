// Angular
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
// Angular

// Material
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSliderModule } from "@angular/material/slider";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatButtonModule } from "@angular/material/button";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { MatRadioModule } from "@angular/material/radio";
import { MatTreeModule } from "@angular/material/tree";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
// Material

// App
import { AppRoutingModule } from "./app-routing.module";
// App

// Components
import { AppComponent } from "./app.component";
import { NavigationComponent } from "./components/navigation/navigation.component";
import { ProjectNavItemComponent } from "./components/project-nav-item/project-nav-item.component";
import { SpeedDialFabComponent } from "./components/speed-dial-fab/speed-dial-fab.component";
import { TodayComponent } from "./components/today/today.component";
import { ProjectComponent } from "./components/project/project.component";
import { SettingsComponent } from "./components/settings/settings.component";
import { ProjectMenuComponent } from "./components/project-menu/project-menu.component";
import { format } from "path";
import { ConfirmComponent } from "./components/confirm/confirm.component";
import { from } from "rxjs";
import { TaskMenuComponent } from "./components/task-menu/task-menu.component";
import { MatNativeDateModule } from "@angular/material/core";
import { ImportProjectMenuComponent } from './components/import-project-menu/import-project-menu.component';

// Components

@NgModule({
	declarations: [
		AppComponent,
		NavigationComponent,
		ProjectNavItemComponent,
		SpeedDialFabComponent,
		TodayComponent,
		ProjectComponent,
		SettingsComponent,
		ProjectMenuComponent,
		ConfirmComponent,
		TaskMenuComponent,
		ImportProjectMenuComponent
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
		MatButtonModule,
		DragDropModule,
		MatExpansionModule,
		MatFormFieldModule,
		MatSelectModule,
		MatDialogModule,
		MatInputModule,
		MatCardModule,
		FormsModule,
		MatRadioModule,
		MatTreeModule,
		MatCheckboxModule,
		MatDatepickerModule,
		MatNativeDateModule
	],
	providers: [],
	exports: [],
	bootstrap: [
		AppComponent
	],
	entryComponents: [
		SettingsComponent
	]
})
export class AppModule {}
