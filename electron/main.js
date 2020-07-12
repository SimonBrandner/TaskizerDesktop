const { app, BrowserWindow, Tray, Menu, ipcMain, dialog } = require("electron");
const url = require("url");
const path = require("path");
const fs = require("fs");
const jp = require("jsonpath");

// Global variables
let window;
let tray;
let menu;

let config;
let configPath = `${app.getPath("appData")}/taskizer.cfg.json`;

let defaultConfig = {
	defaultView: "Today",
	defaultProjectPath: "/",
	projects: []
};

let indexFilePath = "../dist/index.html";
// Global variables

// Init functions
function createTray() {
	// Create the tray menu
	const trayMenu = Menu.buildFromTemplate([
		{
			label: "Toggle window",
			type: "normal",
			click: toggleWindow
		},
		{
			label: "Exit",
			type: "normal",
			click: quitApp
		}
	]);

	tray = new Tray(path.join(__dirname, "../assets/icon.png"));
	tray.setToolTip("This is Taskizer!");
	tray.setContextMenu(trayMenu);
	// Create the tray menu
}

function createWindow() {
	// Create the browser window and set its properties
	window = new BrowserWindow({
		width: 800,
		height: 600,
		title: "Taskizer",
		webPreferences: {
			nodeIntegration: true
		},
		autoHideMenuBar: true,
		icon: path.join(__dirname, "../assets/icon.png")
	});

	window.loadURL(
		url.format({
			pathname: path.join(__dirname, indexFilePath),
			protocol: "file:",
			slashes: true
		})
	);
	// Create the browser window and set its properties

	// Events
	window.on("close", windowCloseEvent);
	// Events
}

function createMenu() {
	menu = Menu.buildFromTemplate([
		{
			label: "App",
			submenu: [
				{
					label: "Hide window",
					click: () => {
						window.hide();
					},
					accelerator: "CommandOrControl+H"
				},
				{
					label: "Quit app",
					click: quitApp,
					accelerator: "CommandOrControl+Q"
				}
			]
		},
		{
			label: "Project",
			submenu: [
				{
					label: "New project",
					click: newProject,
					accelerator: "CommandOrControl+N"
				},
				{
					label: "Import project",
					click: importProject,
					accelerator: "CommandOrControl+I"
				}
			]
		},
		{
			label: "Task",
			submenu: [
				{
					label: "New task",
					click: newTask,
					accelerator: "CommandOrControl+Shift+N"
				}
			]
		},
		{
			label: "Advanced",
			submenu: [
				{
					label: "Toggle developer tools",
					click: () => {
						window.webContents.toggleDevTools();
					},
					accelerator: "F12"
				}
			]
		}
	]);
	Menu.setApplicationMenu(menu);
}

function loadConfig() {
	if (!fs.existsSync(configPath)) {
		fs.writeFileSync(configPath, JSON.stringify(defaultConfig));
	}

	config = JSON.parse(fs.readFileSync(configPath));
}
// Init functions

// window events
function windowCloseEvent(event) {
	event.preventDefault();
	minimizeToTray();
}
// window events

// window functions
function toggleWindow() {
	window.isVisible() ? window.hide() : window.show();
}

function minimizeToTray() {
	window.hide();
}
// window functions

// app functions
function appInit() {
	createWindow();
	createTray();
	createMenu();
	loadConfig();
}

function quitApp() {
	window.destroy();
}
// app functions

// IPC functions - dialogs
function ipcMainSaveDialogSync(event, options) {
	window.webContents.send("saveDialogSyncResponse", dialog.showSaveDialogSync(window, options));
}

function ipcMainOpenDialogSync(event, options) {
	window.webContents.send("openDialogSyncResponse", dialog.showOpenDialogSync(window, options));
}

function ipcMainSaveDialog(event, options) {
	dialog.showSaveDialog(window, options).then((result) => {
		window.webContents.send("saveDialogResponse", result);
	});
}

function ipcMainOpenDialog(event, options) {
	dialog.showOpenDialog(window, options).then((result) => {
		window.webContents.send("openDialogResponse", result);
	});
}
// IPC functions - dialogs

// IPC functions - config
function ipcMainGetConfigEvent(event, pathExpression) {
	window.webContents.send("getConfigResponse", jp.value(config, pathExpression));
}

function ipcMainSetConfigEvent(event, pathExpression, value) {
	jp.value(config, pathExpression, value);
	saveConfig();
}

function ipcMainRunAQueryEvent(event, pathExpression) {
	window.webContents.send("runAQueryResponse", jp.query(config, pathExpression));
}

function ipcMainDeleteProjectFromConfigEvent(event, projectId) {
	config["projects"].forEach((project, index) => {
		if (project.id == projectId) {
			config["projects"].splice(index, 1);
		}
	});
	saveConfig();
}
// IPC functions - config

// IPC functions - project
function ipcMainGetProjectEvent(event, projectPath, pathExpression) {
	var project = JSON.parse(fs.readFileSync(projectPath));
	window.webContents.send("getProjectResponse", project);
}
function ipcMainSetProjectEvent(event, projectPath, pathExpression, value) {
	var project = JSON.parse(fs.readFileSync(projectPath));
	jp.value(project, pathExpression, value);
	fs.writeFileSync(projectPath, JSON.stringify(project));
}

function ipcMainCreateNewProjectEvent(event, projectName, projectPath) {
	if (!fs.existsSync(projectPath)) {
		var project = {
			name: projectName,
			tasks: []
		};
		fs.writeFileSync(projectPath, JSON.stringify(project));
	}
}

function ipcMainCopyProjectFileEvent(event, oldPath, newPath) {
	fs.rename(oldPath, newPath, (error) => {
		if (error) throw error;
	});
}

function ipcMainDeleteProjectFileEvent(event, projectPath) {
	fs.unlinkSync(projectPath);
}
// IPC functions - project

// Config
function saveConfig() {
	fs.writeFileSync(configPath, JSON.stringify(config));
}
// Config

// app events
app.on("ready", appInit); // Create window on electron initialization
// app events

// Menu events
function newProject() {
	window.webContents.send("newProject");
}
function importProject() {
	window.webContents.send("importProject");
}
function newTask() {
	window.webContents.send("newTask");
}
// Menu events

// IPC events - dialogs
ipcMain.on("saveDialogSync", ipcMainSaveDialogSync);
ipcMain.on("openDialogSync", ipcMainOpenDialogSync);
ipcMain.on("saveDialog", ipcMainSaveDialog);
ipcMain.on("openDialog", ipcMainOpenDialog);
// IPC events - dialogs

// IPC events - config
ipcMain.on("getConfig", ipcMainGetConfigEvent);
ipcMain.on("setConfig", ipcMainSetConfigEvent);
ipcMain.on("runAQuery", ipcMainRunAQueryEvent);
// IPC events - config

// IPC events - project
ipcMain.on("getProject", ipcMainGetProjectEvent);
ipcMain.on("setProject", ipcMainSetProjectEvent);
ipcMain.on("createNewProject", ipcMainCreateNewProjectEvent);
ipcMain.on("copyProjectFile", ipcMainCopyProjectFileEvent);
ipcMain.on("deleteProjectFile", ipcMainDeleteProjectFileEvent);
ipcMain.on("deleteProjectFromConfig", ipcMainDeleteProjectFromConfigEvent);
// IPC events - project
