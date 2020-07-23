export class FlatTaskNode {
	name: string;
	level: number;
	expandable: boolean;
	isExpanded: boolean;
	date: Date;
	repeat: {
		preset: string;
		ordinal: number;
		unit: number[];
		category: string;
	};
}
