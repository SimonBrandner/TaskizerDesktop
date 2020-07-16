const { Tray, Menu } = require("electron");

const window = require("./window.js");

// Global variables
let tray;
// Global variables

module.exports = {
	create() {
		const trayMenu = Menu.buildFromTemplate([
			{
				label: "Toggle window",
				type: "normal",
				click: window.toggleWindow
			},
			{
				label: "Exit",
				type: "normal",
				click: global.quitApp
			}
		]);

		tray = global.tray = new Tray(global.appIcon);
		tray.setToolTip("Taskizer");
		tray.setContextMenu(trayMenu);
	}
};
