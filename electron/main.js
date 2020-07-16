const { app, ipcMain } = require("electron");
const path = require("path");

const dialogs = require("./dialogs.js");
const project = require("./project.js");
const config = require("./config.js");
const tray = require("./tray.js");
const menu = require("./menu.js");
const updater = require("./updater.js");
const window = require("./window.js");

// Global variables
let indexFilePath;
let appIcon;
// Global variables

// Init functions
function setupGlobalVariables() {
	indexFilePath = global.indexFilePath = "../dist/index.html";
	appIcon = global.appIcon = path.join(__dirname, "../assets/icons/512x512.png");
}

function appInit() {
	setupGlobalVariables();
	window.create();
	updater.create();
	updater.checkForUpdates();
	menu.create();
	tray.create();
	config.loadConfig();
}

quitApp = global.quitApp = function() {
	global.window.destroy();
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
