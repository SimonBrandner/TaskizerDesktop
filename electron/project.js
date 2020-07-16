const fs = require("fs");
const jp = require("jsonpath");

module.exports = {
	getProject(event, projectPath, pathExpression) {
		var project = JSON.parse(fs.readFileSync(projectPath));
		window.webContents.send("getProjectResponse", project);
	},
	setProject(event, projectPath, pathExpression, value) {
		var project = JSON.parse(fs.readFileSync(projectPath));
		jp.value(project, pathExpression, value);
		fs.writeFileSync(projectPath, JSON.stringify(project));
	},

	createNewProject(event, projectName, projectPath) {
		if (!fs.existsSync(projectPath)) {
			var project = {
				name: projectName,
				tasks: []
			};
			fs.writeFileSync(projectPath, JSON.stringify(project));
		}
	},

	copyProjectFile(event, oldPath, newPath) {
		fs.rename(oldPath, newPath, (error) => {
			if (error) throw error;
		});
	},

	deleteProjectFile(event, projectPath) {
		fs.unlinkSync(projectPath);
	}
};
