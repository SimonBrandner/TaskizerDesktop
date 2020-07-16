const { app, ipcMain, BrowserWindow } = require("electron");
const url = require("url");
const path = require("path");

const dialogs = require("./dialogs.js");
const project = require("./project.js");
const config = require("./config.js");
const tray = require("./tray.js");
const menu = require("./menu.js");
const updater = require("./updater.js");

// Global variables
let window;
let indexFilePath;
let appIcon;
// Global variables

// Init functions
function setupGlobalVariables() {
	indexFilePath = global.indexFilePath = "../dist/index.html";
	appIcon = global.appIcon = path.join(__dirname, "../assets/icons/512x512.png");
}

function createWindow() {
	// Create the browser window and set its properties
	window = global.window = new BrowserWindow({
		width: 800,
		height: 600,
		title: "Taskizer",
		webPreferences: {
			nodeIntegration: true
		},
		autoHideMenuBar: true,
		icon: appIcon
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
// Init functions

// window events
function windowCloseEvent(event) {
	event.preventDefault();
	window.hide();
}
// window events

// window functions
toggleWindow = global.toggleWindow = function() {
	window.isVisible() ? window.hide() : window.show();
};
// window functions

function appInit() {
	setupGlobalVariables();
	createWindow();
	updater.create();
	updater.checkForUpdates();
	menu.create();
	tray.create();
	config.loadConfig();
}

quitApp = global.quitApp = function() {
	window.destroy();
};

// app events
app.on("ready", appInit); // Create window on electron initialization
// app events

// IPC events - dialogs
ipcMain.on("saveDialogSync", dialogs.saveDialogSync);
ipcMain.on("openDialogSync", dialogs.openDialogSync);
ipcMain.on("saveDialog", dialogs.saveDialog);
ipcMain.on("openDialog", dialogs.openDialog);
// IPC events - dialogs

// IPC events - config
ipcMain.on("getConfig", config.getConfig);
ipcMain.on("setConfig", config.setConfig);
ipcMain.on("runAQuery", config.runAQuery);
ipcMain.on("deleteProjectFromConfig", config.deleteProjectFromConfig);
// IPC events - config

// IPC events - project
ipcMain.on("getProject", project.getProject);
ipcMain.on("setProject", project.setProject);
ipcMain.on("createNewProject", project.createNewProject);
ipcMain.on("copyProjectFile", project.copyProjectFile);
ipcMain.on("deleteProjectFile", project.deleteProjectFile);
// IPC events - project
