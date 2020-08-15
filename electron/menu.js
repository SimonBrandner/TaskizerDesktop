const { Menu } = require("electron");
const updater = require("./updater");

module.exports = {
	create() {
		console.log("Creating menu.");
		global.menu = Menu.buildFromTemplate([
			{
				label: "App",
				submenu: [
					{
						label: "Hide window",
						click: () => {
							console.log("Hiding window.");
							window.hide();
						},
						accelerator: "CommandOrControl+H"
					},
					{
						label: "Next navigation item",
						click: module.exports.nextNavigationItem,
						accelerator: "CommandOrControl+Tab"
					},
					{
						label: "Previous navigation item",
						click: module.exports.previousNavigationItem,
						accelerator: "CommandOrControl+Shift+Tab"
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
							console.log("Toggling developer tools.");
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
		console.log("New project button clicked.");
		global.window.webContents.send("newProject");
	},

	importProject() {
		console.log("Import project button clicked.");
		global.window.webContents.send("importProject");
	},

	newTask() {
		console.log("New task button clicked.");
		global.window.webContents.send("newTask");
	},

	nextNavigationItem() {
		console.log("Next navigation item button clicked.");
		global.window.webContents.send("nextNavItem");
	},

	previousNavigationItem() {
		console.log("Previous navigation item button clicked.");
		global.window.webContents.send("previousNavItem");
	}
};
