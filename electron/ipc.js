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
		ipcMain.on("createNewProject", project.createNew);
		ipcMain.on("moveProjectFile", project.moveProjectFile);
		ipcMain.on("deleteProjectFile", project.deleteProjectFile);
		// IPC events - project
	}
};
