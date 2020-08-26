import { Injectable, NgZone } from "@angular/core";
import { IpcRenderer } from "electron";
import { TaskNode } from "../classes/task-node";
import { DialogService } from "./dialog.service";
import { ConfigService } from "./config.service";
import { Router } from "@angular/router";
import { error } from "console";

@Injectable({
	providedIn: "root"
})
export class ProjectService {
	constructor(
		private dialogService: DialogService,
		private configService: ConfigService,
		private zone: NgZone,
		private router: Router
	) {
		if ((<any>window).require) {
			try {
				this.ipcRenderer = (<any>window).require("electron").ipcRenderer;
			} catch (error) {
				throw error;
			}
		}
		else {
			console.warn("Could not load electron ipc");
		}
	}

	getFolderPathFromFullPath(fullPath: string) {
		return fullPath.split("/").slice(0, -1).join("/");
	}

	getNameFromFullPath(fullPath: string) {
		return fullPath.split("/")[fullPath.split("/").length - 1].split(".")[0];
	}

	setProjectContent(projectPath: string, content: any) {
		console.log("Setting project content to", content, ". The path is: ", projectPath);

		this.getProjectByPath(projectPath)
			.then((result) => {
				result["tasks"] = content;

				this.ipcRenderer.once("setProjectResponse", (event, success, payload) => {
					if (success) {
						console.log("Successfully set project with path", projectPath);
					}
					else {
						console.error("An error occurred while setting project with path", projectPath, ":", payload);
						this.zone.run(() => {
							this.dialogService
								.universalDialog({
									title: "An error occurred",
									message:
										'There is a problem with project with path "' +
										projectPath +
										'". Do you wish to remove if from config? Error:' +
										payload,
									actions: [
										{ name: "Yes", response: true },
										{ name: "No", response: false }
									]
								})
								.then((result) => {
									if (result) {
										var project = this.configService.getProjectByPath(projectPath);
										if (project) {
											this.configService.deleteProject(project["id"]);
										}
									}
								});

							this.router.navigate([
								"today"
							]);
						});
					}
				});

				this.ipcRenderer.send("setProject", projectPath, result);
			})
			.catch(() => {});
	}

	createNewProject(projectName: string, projectPath: string): void {
		console.log("Handling new project with name", projectName, "and path", projectPath);

		this.ipcRenderer.once("handleNewProjectResponse", (success, payload) => {
			if (success) {
				console.log("Successfully handled new project with path", projectPath);
			}
			else {
				console.error("An error occurred while handling new project with path", projectPath, ":", payload);
				this.zone.run(() => {
					this.dialogService
						.universalDialog({
							title: "An error occurred",
							message:
								'There is a problem with project with path "' +
								projectPath +
								'". Do you wish to remove if from config? Error:' +
								payload,
							actions: [
								{ name: "Yes", response: true },
								{ name: "No", response: false }
							]
						})
						.then((result) => {
							if (result) {
								var project = this.configService.getProjectByPath(projectPath);
								if (project) {
									this.configService.deleteProject(project["id"]);
								}
							}
						});

					this.router.navigate([
						"today"
					]);
				});
			}
		});

		this.ipcRenderer.send("handleNewProject", projectName, projectPath);
	}

	editProject(oldProject, newProject): void {
		if (oldProject.path != newProject.path) {
			this.moveProject(oldProject.path, newProject.path);
		}

		if (oldProject.name != newProject.name) {
			this.changeProjectName(newProject.path, newProject.name);
		}
	}

	moveProject(oldPath: string, newPath: string): void {
		console.log("Moving project from ", oldPath, " to ", newPath);

		this.ipcRenderer.once("moveProjectResponse", (success, payload) => {
			if (success) {
				console.log("Successfully moved project from", oldPath, "to", newPath);
			}
			else {
				console.error("An error occurred while moving file", oldPath, "to", newPath, ":", payload);
				this.zone.run(() => {
					this.dialogService
						.universalDialog({
							title: "An error occurred",
							message:
								'There is a problem with moving project from "' +
								oldPath +
								'" to "' +
								newPath +
								'". Do you wish to remove if from config? Error:' +
								payload,
							actions: [
								{ name: "Yes", response: true },
								{ name: "No", response: false }
							]
						})
						.then((result) => {
							if (result) {
								var oldProject = this.configService.getProjectByPath(oldPath);
								var newProject = this.configService.getProjectByPath(newPath);

								if (oldProject) {
									this.configService.deleteProject(oldProject["id"]);
								}
								if (newProject) {
									this.configService.deleteProject(newProject["id"]);
								}
							}
						});

					this.router.navigate([
						"today"
					]);
				});
			}
		});

		this.ipcRenderer.send("moveProjectFile", oldPath, newPath);
	}

	changeProjectName(projectPath: string, projectName: string): void {
		console.log("Changing name of project with path", projectPath, "to", projectName);
		this.getProjectByPath(projectPath)
			.then((result) => {
				result["name"] = projectName;

				this.ipcRenderer.once("setProjectResponse", (event, success, payload) => {
					if (success) {
						console.log("Successfully set project with path", projectPath);
					}
					else {
						console.error("An error occurred while setting project with path", projectPath, ":", payload);
						this.zone.run(() => {
							this.dialogService
								.universalDialog({
									title: "An error occurred",
									message:
										'There is a problem with project with path "' +
										projectPath +
										'". Do you wish to remove if from config? Error:' +
										payload,
									actions: [
										{ name: "Yes", response: true },
										{ name: "No", response: false }
									]
								})
								.then((result) => {
									if (result) {
										var project = this.configService.getProjectByPath(projectPath);
										if (project) {
											this.configService.deleteProject(project["id"]);
										}
									}
								});

							this.router.navigate([
								"today"
							]);
						});
					}
				});

				this.ipcRenderer.send("setProject", projectPath, result);
			})
			.catch(() => {});
	}

	deleteProject(projectPath: string): void {
		console.log("Deleting project with path ", projectPath);

		this.ipcRenderer.once("deleteProjectResponse", (event, success, payload) => {
			if (success) {
				console.log("Successfully deleted file", projectPath);
			}
			else {
				console.error("An error occurred while deleting file with path", projectPath, ":", payload);
				this.zone.run(() => {
					this.dialogService.universalDialog({
						title: "An error occurred",
						message: 'There is a problem with project with path "' + projectPath + '". Error:' + payload,
						actions: [
							{ name: "Ok", response: null }
						]
					});

					this.router.navigate([
						"today"
					]);
				});
			}
		});

		this.ipcRenderer.send("deleteProjectFile", projectPath);
	}

	async editTaskByProjectPathAndTaskId(projectPath: string, task: TaskNode): Promise<void> {
		console.log("Editing task", task, "from project with path", projectPath);

		await this.getProjectByPath(projectPath)
			.then((result) => {
				this.setProjectContent(projectPath, this.editTaskInProject(result.tasks, task));
			})
			.catch(() => {});
	}

	private editTaskInProject(oldProjectTasks: Array<TaskNode>, newTask: TaskNode): Array<TaskNode> {
		var newProjectTasks: Array<TaskNode> = [];

		for (let oldProjectTask of oldProjectTasks) {
			if (oldProjectTask.id == newTask.id) {
				oldProjectTask = newTask;
			}
			else if (oldProjectTask.tasks.length > 0) {
				oldProjectTask.tasks = this.editTaskInProject(oldProjectTask.tasks, newTask);
			}
			newProjectTasks.push(oldProjectTask);
		}

		return newProjectTasks;
	}

	deleteTaskByProjectPathAndTaskId(projectPath: string, taskId: number): void {
		console.log("Deleting task with id", taskId, "from project with path", projectPath);

		this.getProjectByPath(projectPath)
			.then((result) => {
				this.setProjectContent(projectPath, this.deleteTaskInProject(result.tasks, taskId));
			})
			.catch(() => {});
	}

	private deleteTaskInProject(oldProjectTasks: Array<TaskNode>, taskId: number): Array<TaskNode> {
		var newProjectTasks: Array<TaskNode> = [];

		for (let oldProjectTask of oldProjectTasks) {
			if (oldProjectTask.id == taskId) {
			}
			else {
				if (oldProjectTask.tasks.length > 0) {
					oldProjectTask.tasks = this.deleteTaskInProject(oldProjectTask.tasks, taskId);
				}
				newProjectTasks.push(oldProjectTask);
			}
		}

		return newProjectTasks;
	}

	async getProjectByPath(projectPath: string): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			this.ipcRenderer.once("getProjectResponse", (event, success, payload) => {
				if (success) {
					console.log("Successfully retrieved project with path", projectPath, ":", payload);
					resolve(payload);
				}
				else {
					console.error("An error occurred while retrieving project with path", projectPath, ":", payload);
					this.zone.run(() => {
						this.dialogService
							.universalDialog({
								title: "An error occurred",
								message:
									'There is a problem with project with path "' +
									projectPath +
									'". Do you wish to remove if from config? Error:' +
									payload,
								actions: [
									{ name: "Yes", response: true },
									{ name: "No", response: false }
								]
							})
							.then((result) => {
								if (result) {
									var project = this.configService.getProjectByPath(projectPath);
									if (project) {
										this.configService.deleteProject(project["id"]);
									}
								}
							});

						this.router.navigate([
							"today"
						]);
					});

					this.zone.run(() => {});
					reject();
				}
			});

			this.ipcRenderer.send("getProject", projectPath);
		});
	}

	private ipcRenderer: IpcRenderer;
}
