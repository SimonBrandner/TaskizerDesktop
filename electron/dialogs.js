const { dialog } = require("electron");

module.exports = {
	saveDialogSync(event, options) {
		console.log("Showing save dialog synchronously.");
		global.window.webContents.send("saveDialogSyncResponse", dialog.showSaveDialogSync(window, options));
	},

	openDialogSync(event, options) {
		console.log("Showing open dialog synchronously.");
		global.window.webContents.send("openDialogSyncResponse", dialog.showOpenDialogSync(window, options));
	},

	saveDialog(event, options) {
		console.log("Showing save dialog asynchronously.");
		dialog.showSaveDialog(window, options).then((result) => {
			console.log("Async save dialog resulted in: " + result.filePaths[0]);
			global.window.webContents.send("saveDialogResponse", result);
		});
	},

	openDialog(event, options) {
		console.log("Showing open dialog asynchronously.");
		dialog.showOpenDialog(window, options).then((result) => {
			console.log("Async open dialog resulted in: " + result.filePaths[0]);
			global.window.webContents.send("openDialogResponse", result);
		});
	}
};
