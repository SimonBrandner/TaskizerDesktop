const { app } = require("electron");
const path = require("path");

const dialogs = require("./dialogs.js");
const project = require("./project.js");
const config = require("./config.js");
const tray = require("./tray.js");
const menu = require("./menu.js");
const updater = require("./updater.js");
const window = require("./window.js");
const ipc = require("./ipc");

global.indexFilePath = "../dist/index.html";
global.appIcon = path.join(__dirname, "../assets/icons/512x512.png");

function main() {
	ipc.create();
	window.create();
	updater.create();
	updater.checkForUpdates();
	menu.create();
	tray.create();
	config.loadConfig();
}

app.on("ready", main); // Create window on electron initialization

quitApp = global.quitApp = function() {
	global.window.destroy();
};
