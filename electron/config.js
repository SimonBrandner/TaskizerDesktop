const { app } = require("electron");
const fs = require("fs");

let configPath = `${app.getPath("appData")}/taskizer.cfg.json`;
let defaultConfig = {
	defaultView: "Today",
	defaultProjectPath: "/",
	theme: "Indigo & Pink",
	projects: []
};

module.exports = {
	get(event) {
		if (!fs.existsSync(configPath)) {
			fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, "\t"));
		}
		config = JSON.parse(fs.readFileSync(configPath));
		console.log("Retrieved config:", config);
		window.webContents.send("getConfigResponse", config);
	},

	set(event, value) {
		console.log("Setting config:", value);
		fs.writeFileSync(configPath, JSON.stringify(value, null, "\t"));
	},

	getProjectPaths() {
		var paths = [];

		if (!fs.existsSync(configPath)) {
			fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, "\t"));
		}

		JSON.parse(fs.readFileSync(configPath))["projects"].forEach((element) => {
			paths.push(element["path"]);
		});

		console.log("Retrieved project paths from config:", paths);
		return paths;
	}
};
