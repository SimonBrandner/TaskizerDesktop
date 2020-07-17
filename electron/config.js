const { app } = require("electron");
const fs = require("fs");
const jp = require("jsonpath");

let configPath = `${app.getPath("appData")}/taskizer.cfg.json`;
let defaultConfig = {
	defaultView: "Today",
	defaultProjectPath: "/",
	projects: []
};

module.exports = {
	get(event, pathExpression) {
		window.webContents.send("getConfigResponse", jp.value(global.config, pathExpression));
	},

	set(event, pathExpression, value) {
		jp.value(global.config, pathExpression, value);
		module.exports.save();
	},

	runAQuery(event, pathExpression) {
		window.webContents.send("runAQueryResponse", jp.query(global.config, pathExpression));
	},

	deleteProject(event, projectId) {
		global.config["projects"].forEach((project, index) => {
			if (project.id == projectId) {
				global.config["projects"].splice(index, 1);
			}
		});
		module.exports.save();
	},

	save() {
		fs.writeFileSync(configPath, JSON.stringify(global.config));
	},

	load() {
		if (!fs.existsSync(configPath)) {
			fs.writeFileSync(configPath, JSON.stringify(defaultConfig));
		}

		global.config = JSON.parse(fs.readFileSync(configPath));
	}
};
