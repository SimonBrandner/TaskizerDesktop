const { Tray, Menu } = require("electron");

const window = require("./window.js");

module.exports = {
	create() {
		console.log("Creating tray.");
		const trayMenu = Menu.buildFromTemplate([
			{
				label: "Toggle window",
				type: "normal",
				click: window.toggle
			},
			{
				label: "Exit",
				type: "normal",
				click: global.quitApp
			}
		]);

		global.tray = new Tray(global.appIcon);
		global.tray.setToolTip("Taskizer");
		global.tray.setContextMenu(trayMenu);
	}
};
