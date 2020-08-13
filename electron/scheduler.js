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

		config.getProjectPaths().forEach((projectPath) => {
			console.log(project);
			project.getFlatTaskList(projectPath).forEach((task) => {
				if (task["reminders"].length > 0) {
					task["reminders"].forEach((reminder) => {
						global.jobs.push(
							schedule.scheduleJob(reminder, () => {
								console.log("Reminder: project path:", projectPath, "task id:", task["id"]);
							})
						);
					});
				}
			});
		});
	}
};
