const { app } = require("electron");
const path = require("path");

const tray = require("./tray.js");
const menu = require("./menu.js");
const updater = require("./updater.js");
const window = require("./window.js");
const ipc = require("./ipc");
const scheduler = require("./scheduler.js");

global.indexFilePath = path.join(__dirname, "../dist/index.html");
global.appIcon = path.join(__dirname, "../assets/icons/512x512.png");
global.jobs = [];
global.angularIsRunning = false;

initApp = function() {
	console.log("Running init.");
	ipc.create();
	window.create();
	updater.create();
	menu.create();
	tray.create();
	updater.checkForUpdates();
	scheduler.cancelAndSetupJobs();
};
global.quitApp = function() {
	console.log("Quitting app.");
	global.window.destroy();
};

app.on("ready", initApp);
