const { Tray, Menu } = require("electron");

// Global variables
let tray;
// Global variables

module.exports = {
	create() {
		const trayMenu = Menu.buildFromTemplate([
			{
				label: "Toggle window",
				type: "normal",
				click: global.toggleWindow
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
