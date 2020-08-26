const { Notification } = require("electron");
const schedule = require("node-schedule");

module.exports = {
	cancelAndSetupJobs() {
		const config = require("./config");
		const project = require("./project");

		console.log("Jobs:", global.jobs);

		if (global.jobs.length > 0) {
			global.jobs.forEach((job) => {
				if (job != null) {
					job.cancel();
				}
			});
			global.jobs = [];
		}

		config.getProjects().forEach((projectInfo) => {
			var taskList = project.getFlatTaskListByProjectPath(projectInfo["path"]);
			if (taskList) {
				taskList.forEach((taskInfo) => {
					if (taskInfo["reminders"].length > 0) {
						taskInfo["reminders"].forEach((reminder) => {
							global.jobs.push(
								schedule.scheduleJob(reminder, () => {
									console.log("Reminder: project:", projectInfo, "task:", taskInfo);

									const notification = new Notification({
										title: "Reminder",
										body: taskInfo["name"],
										icon: global.appIcon
									});
									notification.show();
									notification.on("click", () => {
										console.log("Reminder clicked: project:", projectInfo, "task:", taskInfo);
										global.window.webContents.send("focusOnTask", {
											projectId: projectInfo["id"],
											taskId: taskInfo["id"]
										});
									});
								})
							);
						});
					}
				});
			}
		});
	}
};
