const { autoUpdater } = require("electron-updater");

module.exports = {
	checkForUpdates() {
		console.log("Checking for updates.");
		autoUpdater.checkForUpdatesAndNotify();
	},

	create() {
		console.log("Crating autoUpdater.");
		autoUpdater.autoDownload = true;
		autoUpdater.autoInstallOnAppQuit = true;
		autoUpdater.allowPrerelease = true;
		autoUpdater.on("update-downloaded", () => {
			console.log("Update downloaded.");
			const notification = new Notification({
				title: "Updates available",
				body: "Click to restart the app and install updates.",
				icon: appIcon
			});
			notification.show();
			notification.on("click", () => {
				console.log("Update downloaded notification clicked.");
				autoUpdater.quitAndInstall();
				global.quitApp();
			});
		});
	}
};
