import GoalColors from "src/constants/goal_colors";

export function getDateString(date: Date | null | undefined): string{
	if ((date != undefined) || (date != null)){
		var dateString = new Date(date);
		const month = (dateString.getMonth() + 1).toString().padStart(2, "0");
		const day = dateString.getDate().toString().padStart(2, "0");
		const year = dateString.getFullYear();
		return `${month}/${day}/${year}`;
	}
	else return "";
}

export function getColor(color: string){
	for (var colorIndex = 0; colorIndex < GoalColors.length; colorIndex ++){
		if (GoalColors[colorIndex].name == color){
			return GoalColors[colorIndex];
		}
	}
}