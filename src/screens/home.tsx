import React, { useState, useContext } from 'react';
import {
	ScrollView, 
	StyleSheet, 
	Text, 
	View,
	Pressable
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

// SVG imports
import { Filter } from 'src/assets/components/filter';
import { Setting } from 'src/assets/components/setting';
import Pen from 'assets/svgs/pen.svg';

// Custom Imports
import GoalColors from 'src/constants/goal_colors';
import { Plus } from 'src/assets/components/plus';
import { getDateString } from 'src/functions/index';
import { FilterStruct, GoalStruct } from 'src/interfaces/index';
import { AllTheme, DarkTheme, LightTheme } from 'src/constants/theme';
import { ThemeContext } from 'src/context/index';
import { CheckMark } from 'src/assets/components/check_mark';

function HomeScreen({navigation}: {navigation: any}): JSX.Element {

	async function getFilterOptions(){
		try {
			const asFilterOptions = await AsyncStorage.getItem("FILTER_OPTIONS");
			var output = {
				"colors": [],
				"tags": [],
				"sortBy": ""
			};
			if (asFilterOptions == null) await AsyncStorage.setItem("FILTER_OPTIONS", JSON.stringify(output));
			else output = JSON.parse(asFilterOptions);
			return output;
		} catch (error) {}
	}

	async function getGoalList(){
		try {
			var keys = await AsyncStorage.getAllKeys();
			var goalKeys = keys.filter(item => { return item.search(/^GOAL_[\d]*$/gm) == 0; });
			
			const asGoalList = await AsyncStorage.multiGet(goalKeys);
			var output = [];
			for (var goalIndex = 0; goalIndex < asGoalList.length; goalIndex ++){
				if (asGoalList[goalIndex][1] !== null) {
					output.push(
						JSON.parse(String(asGoalList[goalIndex][1]))
					)
				} 
			}
			return output;
		} catch (error) {}
	}

	function showStatusView(status: string){
		setSfStatusView(status);
	}

	const {isLightTheme, setIsLightTheme } = useContext(ThemeContext);

	const [sfGoalList, setSfGoalList] = useState<GoalStruct[]>([]);
	const [sfStatusView, setSfStatusView] = useState<string>("active");
	const [sfFilterOptions, setSfFilterOptions] = useState<FilterStruct>({
		"colors": [],
		"sortBy": "",
		"tags": []
	});
	const maxEndDate = new Date(9999, 11, 31); // December 31st, 9999

	useFocusEffect(
		React.useCallback(() => {
			// console.log("Focused home screen"); 

			const promiseGoalList = new Promise((resolve, reject) => { 
				resolve(getGoalList()); 
			}); 

			const promiseFilterOptions = new Promise((resolve, reject) => {
				resolve(getFilterOptions()); 
			})

			Promise.all([promiseGoalList, promiseFilterOptions])
			.then((values) => {
				setSfGoalList(values[0] as GoalStruct[]);

				const valFilterStruct = values[1] as FilterStruct;
				setSfFilterOptions(valFilterStruct);
				// if ("statusView" in (valFilterStruct) == true && (valFilterStruct.statusView != undefined)) setSfStatusView(valFilterStruct.statusView);
			})

			// return () => console.log("Unfocused home screen");
		}, [])
	)

	var originalGoalList = [...sfGoalList];
	if (sfFilterOptions.sortBy.length > 0){
		if (sfFilterOptions.sortBy == "startDate"){
			originalGoalList.sort(function(g1, g2){
				var g1Time = new Date(g1.startDate).getTime(); 
				var g2Time = new Date(g2.startDate).getTime(); 
				return g1Time - g2Time; 
			})
		}
		else if (sfFilterOptions.sortBy == "abc"){
			originalGoalList.sort(function(g1, g2){
				return g1.goal.localeCompare(g2.goal);
			});
		}
	} else {
		originalGoalList.sort(function(g1, g2){
			return g1.goalID - g2.goalID; 
		})
	}

	var filteredGoals = [...originalGoalList].filter((goalItem, goalIndex) => {
		var hasValidTag = false; 
		if (sfFilterOptions.tags.length == 0) hasValidTag = true;
		for (var filterTagIndex = 0; filterTagIndex < sfFilterOptions.tags.length; filterTagIndex ++){
			for (var goalTagIndex = 0; goalTagIndex < goalItem.tags.length; goalTagIndex ++){
				if (goalItem.tags[goalTagIndex] == sfFilterOptions.tags[filterTagIndex]){
					hasValidTag = true;
				}
			}
		}
		
		var hasValidColor = false; 
		if (sfFilterOptions.colors.length == 0) hasValidColor = true; 
		for (var filterColorIndex = 0; filterColorIndex < sfFilterOptions.colors.length; filterColorIndex ++){
			if (goalItem.color == sfFilterOptions.colors[filterColorIndex]){
				hasValidColor = true;
			}
		}

		return hasValidTag && hasValidColor && goalItem.status == sfStatusView;
	})

	var hasFilterOptions = (sfFilterOptions.sortBy.length > 0) || (sfFilterOptions.colors.length > 0) || (sfFilterOptions.tags.length > 0);

	return (
		<View style={{backgroundColor: (isLightTheme) ? LightTheme.bgColor : DarkTheme.bgColor, flex: 1}}>
			<View style={{backgroundColor: (isLightTheme) ? LightTheme.bgSecColor : DarkTheme.bgSecColor, padding: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
				<Pressable onPress={() => {navigation.navigate("Settings")}} style={{marginRight: 10}}>
					<View style={{width: 25, height: 25}}>
						<Setting color={(isLightTheme) ? LightTheme.textColor : DarkTheme.textColor} />
					</View>
				</Pressable>
				<Text style={[homeStyle.header, homeStyle.smallText, {fontFamily: AllTheme.fontFamilyBold, color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor}]}>Simple Goals</Text>

				{(() => {
					if (hasFilterOptions){
						return (
							<Pressable onPress={() => {navigation.navigate("Filter")}} style={{marginLeft: 10}}>
								<View style={{width: 25, height: 25}}>
									<Filter color={(isLightTheme) ? LightTheme.textColor : DarkTheme.textColor}/>
								</View>
								<View style={{position: "absolute", top: -5, right: -5, backgroundColor: AllTheme.orange, height: 10 , width: 10, borderRadius: 20}}></View>
							</Pressable>
						)
					}
					else {
						return (
							<Pressable onPress={() => {navigation.navigate("Filter")}} style={{marginLeft: 10}}>
								<View style={{width: 25, height: 25}}>
									<Filter color={(isLightTheme) ? LightTheme.textColor : DarkTheme.textColor}/>
								</View>
							</Pressable>
						)
					}
				})()}
			</View>

			<View style={{backgroundColor: (isLightTheme) ? LightTheme.lineColor : DarkTheme.lineColor, height: 1.5}} />

			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={{padding: 15}}>
					<View>
						<Text style={{fontFamily: AllTheme.fontFamilyReg, textAlign: "center", marginBottom: 15, color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor}}>
							{(sfStatusView == "active") ? "Current" : "Complete"} Goals ({filteredGoals.length})
						</Text>
						{((filteredGoals.length == 0) && (hasFilterOptions) && (originalGoalList.length > 0)) && (
							<View style={{justifyContent: "center"}}>
								<Text style={{fontFamily: AllTheme.fontFamilyReg, textAlign: "center", marginTop: 0, marginHorizontal: 15, color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor}}>No goals matching filter criteria.</Text>
							</View>	
						)}
						<View style={{flexDirection: "column", gap: 15}}>
						{
							filteredGoals.map((goalItem, goalIndex) => {

								var themeColor = "#000000"; // dark grey default
								for (var itemColor of GoalColors){
									if (itemColor.name == goalItem.color){
										if (isLightTheme){
											themeColor = itemColor.hexCodeLight;
										} else {
											themeColor = itemColor.hexCodeDark;
										}
									}
								}

								var hasValidTag = false; 
								if (sfFilterOptions.tags.length == 0) hasValidTag = true;
								for (var filterTagIndex = 0; filterTagIndex < sfFilterOptions.tags.length; filterTagIndex ++){
									for (var goalTagIndex = 0; goalTagIndex < goalItem.tags.length; goalTagIndex ++){
										if (goalItem.tags[goalTagIndex] == sfFilterOptions.tags[filterTagIndex]){
											hasValidTag = true;
										}
									}
								}
								
								var hasValidColor = false; 
								if (sfFilterOptions.colors.length == 0) hasValidColor = true; 
								for (var filterColorIndex = 0; filterColorIndex < sfFilterOptions.colors.length; filterColorIndex ++){
									if (goalItem.color == sfFilterOptions.colors[filterColorIndex]){
										hasValidColor = true;
									}
								}
			
								if (hasValidTag && hasValidColor){

									return (
										<Pressable 
										onPress={() => navigation.navigate("Goal", { goalKey: goalItem.goalKey })} 
										key={goalIndex} 
										style={[homeStyle.goalCard, {backgroundColor: (isLightTheme) ? LightTheme.bgSecColor : DarkTheme.bgSecColor, borderColor: themeColor, borderWidth: 2}]}>
											<View style={{padding: 10, flexDirection: "column", gap: 20}}>
												<View style={{justifyContent: "space-between", flexDirection: "row", gap: 10}}> 
													<Text style={{fontFamily: AllTheme.fontFamilyBold, color: themeColor, fontSize: 20, flex: 1}}>{goalItem.goal}</Text>
													<View>
														<View>
															<Text style={{fontFamily: AllTheme.fontFamilyBold, color: (isLightTheme) ? LightTheme.textTransColor : DarkTheme.textTransColor, fontSize: 12}}>S: {getDateString(goalItem.startDate)}</Text>
														</View>
														<Text style={{fontFamily: AllTheme.fontFamilyBold, color: (isLightTheme) ? LightTheme.textTransColor : DarkTheme.textTransColor, fontSize: 12}}>
															E: {(goalItem.endDate === null) ? "N/A" : getDateString(goalItem.endDate)} 
														</Text>
													</View>
												</View>
												
												{(sfStatusView == "active") && (() => {
													var completedGoalIndex = -1;
													var latestCompletedDate:Date = new Date(1900, 1, 1, 0, 0, 0, 0);
													for (var subGoalIndex = 0; subGoalIndex < goalItem.subGoals.length; subGoalIndex ++){
														if (goalItem.subGoals[subGoalIndex].completeDate != null && goalItem.subGoals[subGoalIndex].completeDate != undefined) { 
															const completeDate = new Date(goalItem.subGoals[subGoalIndex].completeDate as Date);
															if (latestCompletedDate.getTime() < completeDate.getTime()){
																latestCompletedDate = completeDate; 
																completedGoalIndex = subGoalIndex;
															}
														}
													}

													if (completedGoalIndex != -1){
														var lastCompletedGoal = goalItem.subGoals[completedGoalIndex];
														return (
															<View>
																<Text style={{fontFamily: AllTheme.fontFamilyBold, fontSize: 12, color: (isLightTheme) ? LightTheme.textTransColor : DarkTheme.textTransColor, marginBottom: 5}}>
																	Last Completed Subgoal / Reward
																</Text>
																<Text style={{fontFamily: AllTheme.fontFamilyReg, color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor}}>
																	{lastCompletedGoal.subGoal} 
																	{(lastCompletedGoal.reward.length > 0) && (
																		<Text> / {lastCompletedGoal.reward}</Text>
																	)}
																</Text>
															</View>
														)	
													} 
												})()}

												{(sfStatusView == "active") && (() => {
													var incompletedGoalIndex = -1;
													for (var subGoalIndex = 0; subGoalIndex < goalItem.subGoals.length; subGoalIndex ++){
														if (goalItem.subGoals[subGoalIndex].completeDate == null){
															incompletedGoalIndex = subGoalIndex;
															break; 
														} 
													}
													if (incompletedGoalIndex != -1) {
														var lastIncompletedGoal = goalItem.subGoals[incompletedGoalIndex];
														return (
															<View>
																<Text style={{fontSize: 12, fontFamily: AllTheme.fontFamilyBold,  color: (isLightTheme) ? LightTheme.textTransColor : DarkTheme.textTransColor, marginBottom: 5}}>
																	Next Subgoal
																</Text>
																<Text style={{fontFamily: AllTheme.fontFamilyReg, color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor}}>
																	{lastIncompletedGoal.subGoal}
																</Text>
															</View>
														)
													}
												})()}

												{(goalItem.tags.length != 0 && sfStatusView == "active") && (
													<View>
														<View style={{flexDirection: "row", flexWrap: "wrap", gap: 5}}>
															{goalItem.tags.map((tag, tagIndex) => {
																return (
																	<View key={tagIndex} style={{flexDirection: "row", gap: 1}}>
																		<Text style={{fontFamily: AllTheme.fontFamilyBold, color: (isLightTheme) ? LightTheme.textTransColor : DarkTheme.textTransColor, fontSize: 12}}>#{tag}</Text>
																	</View>
																)
															})}
														</View>
													</View>
												)}
											</View>
										</Pressable>
									)
								}
							})
						}
						</View>
					</View>
				</View>
			</ScrollView>
			
			<View style={{backgroundColor: (isLightTheme) ? LightTheme.lineColor : DarkTheme.lineColor, height: 1.5}} />
			<View style={{padding: 15, flexDirection: "row", gap: 15, backgroundColor: (isLightTheme) ? LightTheme.bgSecColor : DarkTheme.bgSecColor}}>
				<Pressable style={[homeStyle.newGoalButton]} onPress={() => navigation.navigate("Goal", { goalKey: "GOAL_0" })}>
					<Plus lineWidth={2} color={DarkTheme.textColor} width={15} />
					<Text style={{fontFamily: AllTheme.fontFamilyReg, color: DarkTheme.textColor}}>Start a New Goal</Text>
				</Pressable>
				<Pressable 
				onPress={() => { 
					if (sfStatusView == "active") showStatusView("complete")
					else if (sfStatusView == "complete") showStatusView("active")
				}}
				style={{borderWidth: 2, padding: 8, borderRadius: 5, borderColor: AllTheme.orange, alignItems: "center", flexDirection: "row"}}>
					<View style={{width: 18, height: 18}}>
						<CheckMark color={(sfStatusView == "complete") ? AllTheme.orange : (isLightTheme) ? LightTheme.lineColor : DarkTheme.lineColor} lineWidth={25}/>
					</View>
				</Pressable>
			</View>
		</View>
	);
}

const homeStyle = StyleSheet.create({
	header: {
		textAlign: "center"
	},
	smallText: {
		fontSize: 16
	},
	newGoalButton: {
		backgroundColor: AllTheme.orange, 
		flexDirection: "row", 
		gap: 5, 
		alignItems: "center", 
		justifyContent: "center", 
		paddingVertical: 10, 
		borderRadius: 5,
		flexGrow: 1
	},
	commonButton: {
		backgroundColor: "#D8D8D8",
		borderRadius: 5
	},
	commonButtonText: {
		textAlign: "center"
	},
	goalCard: {
		borderRadius: 5, 
		overflow: "hidden"
	}
})

export default HomeScreen;
