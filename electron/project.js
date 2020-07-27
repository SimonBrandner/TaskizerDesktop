const fs = require("fs");
const jp = require("jsonpath");

module.exports = {
	get(event, projectPath) {
		var project = JSON.parse(fs.readFileSync(projectPath));
		console.log("Retrieved project ", project["name"], " with path ", projectPath, ": ", project);
		window.webContents.send("getProjectResponse", project);
	},
	set(event, projectPath, project) {
		console.log("Setting project ", project["name"], " with path ", projectPath, ": ", project);
		fs.writeFileSync(projectPath, JSON.stringify(project));
	},

	handleNew(event, projectName, projectPath) {
		console.log("Creating new project with name ", projectName, " and path ", projectPath);
		if (!fs.existsSync(projectPath)) {
			fs.writeFileSync(
				projectPath,
				JSON.stringify({
					name: projectName,
					tasks: []
				})
			);
		}
	},

	moveFile(event, oldPath, newPath) {
		console.log("Moving project ", oldPath, " to ", newPath);
		fs.rename(oldPath, newPath, (error) => {
			if (error) throw error;
		});
	},

	deleteFile(event, projectPath) {
		console.log("Deleting project file with path ", projectPath);
		fs.unlinkSync(projectPath);
	}
};
