const fs = require("fs");
const jp = require("jsonpath");

module.exports = {
	get(event, projectPath) {
		console.log("Getting project with path " + projectPath);
		var project = JSON.parse(fs.readFileSync(projectPath));
		window.webContents.send("getProjectResponse", project);
	},
	set(event, projectPath, pathExpression, value) {
		console.log("Setting project with path " + projectPath);
		var project = JSON.parse(fs.readFileSync(projectPath));
		jp.value(project, pathExpression, value);
		fs.writeFileSync(projectPath, JSON.stringify(project));
	},

	createNew(event, projectName, projectPath) {
		console.log("Creating new project with name " + projectName + " and path " + projectPath);
		if (!fs.existsSync(projectPath)) {
			var project = {
				name: projectName,
				tasks: []
			};
			fs.writeFileSync(projectPath, JSON.stringify(project));
		}
	},

	moveProjectFile(event, oldPath, newPath) {
		console.log("Moving project " + oldPath + " to " + newPath);
		fs.rename(oldPath, newPath, (error) => {
			if (error) throw error;
		});
	},

	deleteProjectFile(event, projectPath) {
		console.log("Deleting project file with path " + projectPath);
		fs.unlinkSync(projectPath);
	}
};
