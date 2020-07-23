export class TaskNode {
	name: string;
	tasks: TaskNode[];
	isExpanded: boolean;
	date: Date;
	repeat: {
		preset: string;
		ordinal: number;
		unit: number[];
		category: string;
	};
}
