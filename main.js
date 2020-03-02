const { app, BrowserWindow, Tray, Menu, MenuItem } = require("electron");
const url = require("url");
const path = require("path");

// Global variables
let window;
let tray;
let menu;

let indexFilePath = "/dist/index.html";
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
			click: app.quit
		}
	]);

	tray = new Tray("src/favicon.ico");
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
		}
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
	window.on("closed", windowClosedEvent);
	window.on("minimize", minimizeToTray);
	// Events
}

function createMenu() {
	menu = Menu.buildFromTemplate([
		{
			label: "File",
			submenu: [
				{
					label: "Quit",
					click: app.quit,
					accelerator: "CommandOrControl+Q"
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
function windowClosedEvent() {
	window = null;
}
// window events

// window functions
function toggleWindow() {
	window.isVisible() ? window.hide() : window.show();
}

function minimizeToTray(event) {
	event.preventDefault();
	window.hide();
}
// window functions

// app functions
function appInit() {
	createWindow();
	createTray();
	createMenu();
}
// app functions

// Create window on electron initialization
app.on("ready", appInit);
