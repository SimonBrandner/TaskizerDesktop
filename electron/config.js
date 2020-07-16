const { app } = require("electron");
const fs = require("fs");
const jp = require("jsonpath");

let config;
let configPath = `${app.getPath("appData")}/taskizer.cfg.json`;
let defaultConfig = {
	defaultView: "Today",
	defaultProjectPath: "/",
	projects: []
};

module.exports = {
	getConfig(event, pathExpression) {
		window.webContents.send("getConfigResponse", jp.value(config, pathExpression));
	},

	setConfig(event, pathExpression, value) {
		jp.value(config, pathExpression, value);
		module.exports.saveConfig();
	},

	runAQuery(event, pathExpression) {
		window.webContents.send("runAQueryResponse", jp.query(config, pathExpression));
	},

	deleteProjectFromConfig(event, projectId) {
		config["projects"].forEach((project, index) => {
			if (project.id == projectId) {
				config["projects"].splice(index, 1);
			}
		});
		saveConfig();
	},

	saveConfig() {
		fs.writeFileSync(configPath, JSON.stringify(config));
	},

	loadConfig() {
		if (!fs.existsSync(configPath)) {
			fs.writeFileSync(configPath, JSON.stringify(defaultConfig));
		}

		config = JSON.parse(fs.readFileSync(configPath));
	}
};
