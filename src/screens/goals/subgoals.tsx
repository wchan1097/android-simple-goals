import React, { useState, useContext } from 'react';
import {
	Text, 
	View,
	Pressable,
	ScrollView,
	Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

// Custom Imports
import { GoalStruct, SubGoalStruct } from 'src/interfaces/index';
import { AllTheme, DarkTheme, LightTheme } from 'src/constants/theme';
import { ThemeContext, GoalContext } from 'src/context';
import { Plus } from 'src/assets/components/plus';
import { CheckMark } from 'src/assets/components/check_mark';
import { getDateString, getColor } from 'src/functions';
import { LeftArrow } from 'src/assets/components/left_arrow';

const SubGoals = ({route, navigation}: {route: any, navigation: any}) => {

	async function getGoalData(goalKey: string){
		if (goalKey != "GOAL_0"){
			try {
				var asGoalData = await AsyncStorage.getItem(goalKey);
				if (asGoalData != null){
					return JSON.parse(asGoalData);
				} else {
					return null;
				}
			} catch(error) {}
		}
	}

	async function deleteGoal(goalKey: string){
		try {
			Alert.alert(
				"",
				"Please confirm you would like to delete this goal.",
				[
					{ text: "Cancel" },
					{ text: "Delete", onPress: async () => {
						await AsyncStorage.removeItem(goalKey);
						navigation.getParent("AppBarNav").navigate("Home");
					}}
				]
			)
		} catch(error) {}
	}

	const {isLightTheme, setIsLightTheme} = useContext(ThemeContext);
	const {goalKey, setGoalKey} = useContext(GoalContext);

	const [sfSubGoalList, setSfSubGoalList] = useState<SubGoalStruct[]>([]);
	
	useFocusEffect(
		React.useCallback(() => {
			// console.log("Focused home screen");

			const promiseGoal = new Promise((resolve, reject) => {
				resolve(getGoalData(goalKey));
			})

			Promise.all([promiseGoal]).then((values) => {
				var resGoalData = values[0];

				if (resGoalData != null){
					var GoalData = resGoalData as GoalStruct;
					setSfSubGoalList(GoalData.subGoals);
				}
			})
			
			// return () => console.log("Unfocused home screen");
		}, [])
	)

	return ( 
		<>
			<View style={{backgroundColor: (isLightTheme) ? LightTheme.bgColor : DarkTheme.bgColor, flex: 1}}>

				<View style={{backgroundColor: (isLightTheme) ? LightTheme.bgSecColor : DarkTheme.bgSecColor, flexDirection: "row", alignContent: "center", justifyContent: "space-between", padding: 15}}>
					<Pressable style={{flexDirection: "row", alignItems: "center", gap: 7}} onPress={() => navigation.getParent("AppBarNav").navigate("Home")}>
						<LeftArrow color={(isLightTheme) ? LightTheme.textColor : DarkTheme.textColor} width={9} height={15} lineWidth={2} />
						<Text style={{color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor, fontFamily: AllTheme.fontFamilyBold}}>
							{((goalKey != "GOAL_0")) ? "Edit Goal" : "New Goal"}
						</Text>
					</Pressable>
					{(goalKey != "GOAL_0") && ( 
						<View>
							<Pressable onPress={() => {deleteGoal(goalKey)}}>
								<Text style={{fontFamily: AllTheme.fontFamilyBold, textAlign: "center", color: (isLightTheme) ? getColor("red")?.hexCodeLight : getColor("red")?.hexCodeDark}}>Delete Goal</Text>
							</Pressable>
						</View>
					)}
				</View>

				<View style={{backgroundColor: (isLightTheme) ? LightTheme.lineColor : DarkTheme.lineColor, height: 1.5}} />

				<View style={{backgroundColor: (isLightTheme) ? LightTheme.bgSecColor : DarkTheme.bgSecColor}}>
					<View style={{flexDirection: "row"}}>
						<Pressable
						onPress={() => { navigation.navigate("Main", { goalKey: goalKey }); }}
						style={{flex: 1, padding: 15}}>
							<Text style={{fontFamily: AllTheme.fontFamilyReg, textAlign: "center", color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor}}>Main</Text>
						</Pressable>
						<Pressable
						onPress={() => {}}
						style={{flex: 1, padding: 15}}>
							<Text style={{fontFamily: AllTheme.fontFamilyBold, textAlign: "center", color: AllTheme.orange}}>Subgoals</Text>
						</Pressable>
					</View>
					<View style={{marginTop: 1, backgroundColor: (isLightTheme) ? LightTheme.lineColor : DarkTheme.lineColor, height: 1.5}} />
				</View>

				{(sfSubGoalList.length == 0) && (
					<View style={{flex: 1, justifyContent: "center"}}>
						<Text style={{fontFamily: AllTheme.fontFamilyReg, textAlign: "center", fontSize: 16, color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor}}>
							No subgoals have been created.
						</Text>
						<Text style={{fontFamily: AllTheme.fontFamilyBold, textAlign: "center", fontSize: 16, marginHorizontal: 15, color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor}}>
							Please press the orange button below to add a new subgoal.
						</Text>
						{(goalKey == "GOAL_0") && (
							<Text style={{fontFamily: AllTheme.fontFamilyReg, textAlign: "center", fontSize: 16, marginTop: 30, marginHorizontal: 15, color: AllTheme.orange}}>
								P.S. Subgoals are only applicable for preexisting goals. Proceed to the "Main" tab and save this goal.
							</Text>
						)}
					</View>
				)}

				{(sfSubGoalList.length > 0) && (
					<ScrollView showsVerticalScrollIndicator={false}>
						<View style={{padding: 15, gap: 15}}>
							{
								sfSubGoalList.map((subGoalItem, subGoalIndex) => {
									return (
										<Pressable onPress = {() => { navigation.getParent().navigate("SubGoal", { goalKey: goalKey, subGoalID: subGoalItem.subGoalID })}}
											key={subGoalItem.subGoalID} style={{gap: 20, borderWidth: 2,borderColor: (isLightTheme) ? LightTheme.lineColor : DarkTheme.lineColor, borderRadius: 5, backgroundColor: (isLightTheme) ? LightTheme.bgSecColor : DarkTheme.bgSecColor, padding: 10}}>
											
											<View style={{flexDirection: "row", justifyContent: "space-between"}}>
												<View style={{flex: 1}}>
													<View style={{flexDirection: "row", gap: 10}}>
														<Text style={{fontSize: 12, fontFamily: AllTheme.fontFamilyBold, color: (isLightTheme) ? LightTheme.textTransColor : DarkTheme.textTransColor, marginBottom: 5}}>
															SubGoal
														</Text>
													</View>
													
													<Text style={{fontFamily: AllTheme.fontFamilyReg, color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor}}>
														{subGoalItem.subGoal}
													</Text>
												</View>
												{((subGoalItem.completeDate != null) && (subGoalItem.completeDate != undefined)) && (
													<View>
														<View style={{flexDirection: "row", justifyContent: "space-between", marginTop: 2}}>
															<Text style={{fontSize: 12, fontFamily: AllTheme.fontFamilyBold, color: (isLightTheme) ? LightTheme.textTransColor : DarkTheme.textTransColor, marginBottom: 5}}>C: </Text>
															<Text style={{fontSize: 12, fontFamily: AllTheme.fontFamilyBold, color: (isLightTheme) ? LightTheme.textTransColor : DarkTheme.textTransColor}}>{getDateString(subGoalItem.completeDate)}</Text>
															<View style={{width: 12, height: 12, marginLeft: 5}}>
																<CheckMark color={AllTheme.orange} lineWidth={20} />
															</View>
														</View>
													</View>
												)}
											</View>
											
											<View>
												<Text style={{fontSize: 12, fontFamily: AllTheme.fontFamilyBold, color: (isLightTheme) ? LightTheme.textTransColor : DarkTheme.textTransColor, marginBottom: 5}}>Reward</Text>
												<Text style={{fontFamily: AllTheme.fontFamilyReg, color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor}}>
													{(subGoalItem.reward.length == 0) ? "No reward listed." : subGoalItem.reward}
												</Text>
											</View>
										</Pressable>
									)
								}) 
							}
						</View>
					</ScrollView>
				
				)}

				<Pressable
				disabled={goalKey == "GOAL_0"}
				onPress={() => { navigation.getParent().navigate("SubGoal", { goalKey: goalKey, subGoalID: 0 }); }}
				style={{position: "absolute", bottom: 15, right: 15, padding: 10, borderRadius: 100, backgroundColor: AllTheme.orange, opacity: (goalKey == "GOAL_0") ? .5 : 1}}>
					<Plus lineWidth={3} color={DarkTheme.textColor} width={25} />
				</Pressable>

			</View>
		</>
	)
}

export default SubGoals;