export interface GoalStruct {
	goalID: number, 
	goalKey: string,
	goal: string;
	startDate: Date;
	endDate: Date | undefined | null; 
	motivation: string; 
	subGoals: SubGoalStruct[];
	tags: string[];
	color: string;
	status: string;
	addInfo: string;
}

export interface SubGoalStruct {
	subGoal: string,
	completeDate: Date | undefined | null,
	subGoalID: number,
	reward: string 
}

export interface FilterStruct {
	colors: string[],
	tags: string[],
	sortBy: string,
	statusView?: string
}