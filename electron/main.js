const { app } = require("electron");
const path = require("path");

const config = require("./config.js");
const tray = require("./tray.js");
const menu = require("./menu.js");
const updater = require("./updater.js");
const window = require("./window.js");
const ipc = require("./ipc");

global.indexFilePath = "../dist/index.html";
global.appIcon = path.join(__dirname, "../assets/icons/512x512.png");

initApp = function() {
	ipc.create();
	window.create();
	updater.create();
	updater.checkForUpdates();
	menu.create();
	tray.create();
	config.load();
};
global.quitApp = function() {
	global.window.destroy();
};

app.on("ready", initApp);
