const fs = require("fs");

module.exports = {
	get(event, projectPath) {
		try {
			var project = JSON.parse(fs.readFileSync(projectPath));

			console.log("Successfully retrieved project with path", projectPath, ":", project);
			window.webContents.send("getProjectResponse", true, project);
		} catch (error) {
			console.error("An error occurred while retrieving project with path", projectPath, ":", error);
			window.webContents.send("getProjectResponse", false, error);
		}
	},

	set(event, projectPath, project) {
		try {
			const scheduler = require("./scheduler");

			fs.writeFileSync(projectPath, JSON.stringify(project, null, "\t"));
			scheduler.cancelAndSetupJobs();

			console.log("Successfully set project with path", projectPath, ":", project);
			window.webContents.send("setProjectResponse", true);
		} catch (error) {
			console.error("An error occurred while setting project with path", projectPath, ":", error);
			window.webContents.send("setProjectResponse", false, error);
		}
	},

	handleNew(event, projectName, projectPath) {
		try {
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

			console.log("Successfully handled new project with path", projectPath);
			window.webContents.send("handleNewProjectResponse", true);
		} catch (error) {
			console.error("An error occurred while handling new project with path", projectPath, ":", error);
			window.webContents.send("handleNewProjectResponse", false, error);
		}
	},

	moveFile(event, oldPath, newPath) {
		try {
			fs.rename(oldPath, newPath, (error) => {
				if (error) throw error;
			});

			console.log("Successfully moved project from", oldPath, "to", newPath);
			global.window.webContents.send("moveProjectFileResponse", true);
		} catch (error) {
			console.error("An error occurred while moving file", oldPath, "to", newPath, ":", error);
			global.window.webContents.send("moveProjectFileResponse", false, error);
		}
	},

	deleteFile(event, projectPath) {
		try {
			fs.unlinkSync(projectPath);

			console.log("Successfully deleted file", projectPath);
			global.window.webContents.send("deleteProjectResponse", true);
		} catch (error) {
			console.error("An error occurred while deleting file with path", projectPath, ":", error);
			global.window.webContents.send("deleteProjectResponse", false, error);
		}
	},

	getFlatTaskListByProjectPath(projectPath) {
		// TODO: Handle error
		try {
			var flatTaskList = [];

			flatTaskList = getTasks(JSON.parse(fs.readFileSync(projectPath))["tasks"]);
			console.log("Retrieved flat task list from project with path", projectPath, ":", flatTaskList);
			return flatTaskList;
		} catch (error) {
			switch (error.code) {
				case "ENOENT":
					console.log("This project file does not exist", error.path);
					global.window.webContents.send(
						"error",
						"Missing file",
						"This project file does not exist: " + error.path + "!"
					);
					break;
				default:
					console.log(error);
					global.window.webContents.send("error", "Unknown error", error.message);
					break;
			}

			return [];
		}
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
