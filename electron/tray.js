const { Tray, Menu } = require("electron");

const window = require("./window.js");

module.exports = {
	create() {
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
		tray.setToolTip("Taskizer");
		tray.setContextMenu(trayMenu);
	}
};
