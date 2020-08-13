const fs = require("fs");

module.exports = {
	get(event, projectPath) {
		var project = JSON.parse(fs.readFileSync(projectPath));
		console.log("Retrieved project", project["name"], "with path", projectPath, ":", project);
		window.webContents.send("getProjectResponse", project);
	},

	set(event, projectPath, project) {
		const scheduler = require("./scheduler");

		console.log("Setting project", project["name"], "with path", projectPath, ":", project);
		fs.writeFileSync(projectPath, JSON.stringify(project, null, "\t"));
		scheduler.cancelAndSetupJobs();
	},

	handleNew(event, projectName, projectPath) {
		console.log("Creating new project with name", projectName, "and path", projectPath);
		if (!fs.existsSync(projectPath)) {
			fs.writeFileSync(
				projectPath,
				JSON.stringify(
					{
						name: projectName,
						tasks: []
					},
					null,
					"\t"
				)
			);
		}
	},

	moveFile(event, oldPath, newPath) {
		console.log("Moving project", oldPath, "to", newPath);
		fs.rename(oldPath, newPath, (error) => {
			if (error) throw error;
		});
	},

	deleteFile(event, projectPath) {
		console.log("Deleting project file with path", projectPath);
		fs.unlinkSync(projectPath);
	},

	getFlatTaskList(projectPath) {
		var flatTaskList = [];

		flatTaskList = getTasks(JSON.parse(fs.readFileSync(projectPath))["tasks"]);
		console.log("Retrieved flat task list from project with path", projectPath, ":", flatTaskList);
		return flatTaskList;
	}
};

function getTasks(tasks) {
	var output = [];

	tasks.forEach((element) => {
		output.push(element);

		if (element["tasks"].length > 0) {
			output = output.concat(getTasks(element["tasks"]));
		}
	});

	return output;
}
