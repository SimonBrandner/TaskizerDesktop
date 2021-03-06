const { BrowserWindow } = require("electron");
const url = require("url");

module.exports = {
	create() {
		console.log("Creating window.");
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

		global.window.loadURL(
			url.format({
				pathname: global.indexFilePath,
				protocol: "file:",
				slashes: true
			})
		);

		global.window.on("close", (event) => {
			console.log("Closing window.");
			event.preventDefault();
			global.window.hide();
		});
	},

	toggle() {
		global.window.isVisible() ? global.window.hide() : global.window.show();
	}
};
