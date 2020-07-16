const { dialog } = require("electron");

module.exports = {
	saveDialogSync(event, options) {
		global.window.webContents.send("saveDialogSyncResponse", dialog.showSaveDialogSync(window, options));
	},

	openDialogSync(event, options) {
		global.window.webContents.send("openDialogSyncResponse", dialog.showOpenDialogSync(window, options));
	},

	saveDialog(event, options) {
		dialog.showSaveDialog(window, options).then((result) => {
			global.window.webContents.send("saveDialogResponse", result);
		});
	},

	openDialog(event, options) {
		dialog.showOpenDialog(window, options).then((result) => {
			global.window.webContents.send("openDialogResponse", result);
		});
	}
};
