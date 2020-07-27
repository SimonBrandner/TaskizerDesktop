const { ipcMain } = require("electron");

const dialogs = require("./dialogs.js");
const project = require("./project.js");
const config = require("./config.js");

module.exports = {
	create() {
		console.log("Creating ipc.");

		// IPC events - dialogs
		ipcMain.on("saveDialogSync", dialogs.saveDialogSync);
		ipcMain.on("openDialogSync", dialogs.openDialogSync);
		ipcMain.on("saveDialog", dialogs.saveDialog);
		ipcMain.on("openDialog", dialogs.openDialog);
		// IPC events - dialogs

		// IPC events - config
		ipcMain.on("getConfig", config.get);
		ipcMain.on("setConfig", config.set);
		// IPC events - config

		// IPC events - project
		ipcMain.on("getProject", project.get);
		ipcMain.on("setProject", project.set);
		ipcMain.on("handleNewProject", project.handleNew);
		ipcMain.on("moveProjectFile", project.moveFile);
		ipcMain.on("deleteProjectFile", project.deleteFile);
		// IPC events - project
	}
};
