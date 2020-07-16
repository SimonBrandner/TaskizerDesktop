const { BrowserWindow } = require("electron");
const url = require("url");
const path = require("path");

module.exports = {
	create() {
		global.window = new BrowserWindow({
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
				pathname: path.join(__dirname, global.indexFilePath),
				protocol: "file:",
				slashes: true
			})
		);

		window.on("close", module.exports.windowCloseEvent);
	},

	windowCloseEvent(event) {
		event.preventDefault();
		global.window.hide();
	},

	toggleWindow() {
		global.window.isVisible() ? global.window.hide() : global.window.show();
	}
};
