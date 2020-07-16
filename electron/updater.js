const { autoUpdater } = require("electron-updater");

module.exports = {
	checkForUpdates() {
		autoUpdater.checkForUpdatesAndNotify();
	},

	create() {
		autoUpdater.autoDownload = true;
		autoUpdater.autoInstallOnAppQuit = true;
		autoUpdater.allowPrerelease = true;
		autoUpdater.on("update-downloaded", () => {
			const notification = new Notification({
				title: "Updates available",
				body: "Click to restart the app and install updates.",
				icon: appIcon
			});
			notification.show();
			notification.on("click", () => {
				autoUpdater.quitAndInstall();
				quitApp();
			});
		});
	}
};
