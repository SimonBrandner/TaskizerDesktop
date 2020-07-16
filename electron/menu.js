const { Menu } = require("electron");
const updater = require("./updater");

module.exports = {
	create() {
		global.menu = Menu.buildFromTemplate([
			{
				label: "App",
				submenu: [
					{
						label: "Hide window",
						click: () => {
							window.hide();
						},
						accelerator: "CommandOrControl+H"
					},
					{
						label: "Check for updates",
						click: updater.checkForUpdates
					},
					{
						label: "Quit app",
						click: global.quitApp,
						accelerator: "CommandOrControl+Q"
					}
				]
			},
			{
				label: "Project",
				submenu: [
					{
						label: "New project",
						click: module.exports.newProject,
						accelerator: "CommandOrControl+N"
					},
					{
						label: "Import project",
						click: module.exports.importProject,
						accelerator: "CommandOrControl+I"
					}
				]
			},
			{
				label: "Task",
				submenu: [
					{
						label: "New task",
						click: module.exports.newTask,
						accelerator: "CommandOrControl+Shift+N"
					}
				]
			},
			{
				label: "Advanced",
				submenu: [
					{
						label: "Toggle developer tools",
						click: () => {
							window.webContents.toggleDevTools();
						},
						accelerator: "F12"
					}
				]
			}
		]);
		Menu.setApplicationMenu(menu);
	},

	newProject() {
		global.window.webContents.send("newProject");
	},

	importProject() {
		global.window.webContents.send("importProject");
	},

	newTask() {
		global.window.webContents.send("newTask");
	}
};
