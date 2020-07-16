const { app, ipcMain, BrowserWindow, Menu, Notification } = require("electron");
const { autoUpdater } = require("electron-updater");
const url = require("url");
const path = require("path");

const dialogs = require("./dialogs.js");
const project = require("./project.js");
const config = require("./config.js");
const tray = require("./tray.js");

// Global variables
let window;
let menu;
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
					label: "Check for updates",
					click: () => {
						autoUpdater.checkForUpdatesAndNotify();
					}
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

// app functions
function appInit() {
	setupGlobalVariables();
	createWindow();
	createMenu();
	tray.create();
	config.loadConfig();
	autoUpdater.checkForUpdatesAndNotify();
}

quitApp = global.quitApp = function() {
	window.destroy();
};
// app functions

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

// Auto updater
autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;
autoUpdater.allowPrerelease = true;
autoUpdater.on("update-downloaded", () => {
	const notification = new Notification({
		title: "Updates available",
		body: "Click to restart the app and install updates.",
		icon: appIcon
	});
	notification.show();
	notification.on("click", () => {
		autoUpdater.quitAndInstall();
		quitApp();
	});
});
// Auto updater

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
