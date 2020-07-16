const { ipcMain } = require("electron");

const dialogs = require("./dialogs.js");
const project = require("./project.js");
const config = require("./config.js");

module.exports = {
	create() {
		// IPC events - dialogs
		ipcMain.on("saveDialogSync", dialogs.saveDialogSync);
		ipcMain.on("openDialogSync", dialogs.openDialogSync);
		ipcMain.on("saveDialog", dialogs.saveDialog);
		ipcMain.on("openDialog", dialogs.openDialog);
		// IPC events - dialogs

		// IPC events - config
		ipcMain.on("getConfig", config.getConfig);
		ipcMain.on("setConfig", config.setConfig);
		ipcMain.on("runAQuery", config.runAQuery);
		ipcMain.on("deleteProjectFromConfig", config.deleteProjectFromConfig);
		// IPC events - config

		// IPC events - project
		ipcMain.on("getProject", project.getProject);
		ipcMain.on("setProject", project.setProject);
		ipcMain.on("createNewProject", project.createNewProject);
		ipcMain.on("copyProjectFile", project.copyProjectFile);
		ipcMain.on("deleteProjectFile", project.deleteProjectFile);
		// IPC events - project
	}
};
