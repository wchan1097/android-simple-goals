import React, { useState, useContext } from 'react';
import {
	TextInput,
	Text, 
	View,
	Pressable,
	ToastAndroid,
	Alert
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

// SVG imports
import Clock from 'assets/svgs/clock.svg';

// Custom Imports
import { getDateString, getColor } from 'src/functions';
import { GoalStruct, SubGoalStruct } from 'src/interfaces/index';
import { AllTheme, DarkTheme, LightTheme } from 'src/constants/theme';
import { ThemeContext } from 'src/context';
import AllStyles from 'src/constants/styles';
import { LeftArrow } from 'src/assets/components/left_arrow';

const SubGoal = ({route, navigation}: {route: any, navigation: any}) => {

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

	async function deleteSubGoal(subGoalID: number){
		Alert.alert(
			"",
			"Please confirm you would like to delete this subgoal.",
			[
				{ text: "Cancel"  },
				{ text: "Delete" , onPress: async () => {
					try {
						if (goalKey != "GOAL_0"){
							try {
								var asGoalData = await AsyncStorage.getItem(goalKey);
								if (asGoalData != null){
									var goalData = JSON.parse(asGoalData) as GoalStruct;
									var subGoalList = [...goalData.subGoals] as SubGoalStruct[];
									var currentIndex = 0;
			
									for (var subGoalIndex = 0; subGoalIndex < subGoalList.length; subGoalIndex ++){
										if (subGoalList[subGoalIndex].subGoalID == subGoalID) {
											currentIndex = subGoalIndex;
										}
									}
									
									subGoalList.splice(currentIndex, 1);
									goalData.subGoals = subGoalList;
									await AsyncStorage.setItem(goalKey, JSON.stringify(goalData));
									navigation.goBack();
								}
							} catch(error) {}
						}			
					} catch (error) {}
				}}
			]
		)
	}

	async function saveSubGoal(){
		var newSubGoal: SubGoalStruct = {
			subGoalID: subGoalID,
			subGoal: sfSubGoal.trim(),
			reward: sfReward.trim(),
			completeDate: sfCompleteDate
		}

		try {
			if (goalKey != "GOAL_0"){
				try {
					var asGoalData = await AsyncStorage.getItem(goalKey);
					if (asGoalData != null){
						var goalData = JSON.parse(asGoalData) as GoalStruct;
						var subGoalList = [...goalData.subGoals] as SubGoalStruct[];

						if (subGoalID == 0) {
							var maxIndex = 0;

							for (var subGoalIndex = 0; subGoalIndex < subGoalList.length; subGoalIndex ++){
								if (subGoalList[subGoalIndex].subGoalID > maxIndex) {
									maxIndex = subGoalList[subGoalIndex].subGoalID;
								}
							}

							maxIndex ++;

							newSubGoal.subGoalID = maxIndex;
							setSubGoalID(maxIndex);
							subGoalList.push(newSubGoal);
							goalData.subGoals = subGoalList;
							await AsyncStorage.setItem(goalKey, JSON.stringify(goalData));
							ToastAndroid.show("New subgoal has been added.", ToastAndroid.SHORT);
						} else { 
							var currentIndex = 0;

							for (var subGoalIndex = 0; subGoalIndex < subGoalList.length; subGoalIndex ++){
								if (subGoalList[subGoalIndex].subGoalID == subGoalID) {
									currentIndex = subGoalIndex;
								}
							}

							subGoalList[currentIndex] = {...newSubGoal};
							goalData.subGoals = subGoalList;
							await AsyncStorage.setItem(goalKey, JSON.stringify(goalData));
							ToastAndroid.show("Subgoal changes have been saved.", ToastAndroid.SHORT);
						}
						
					}
				} catch(error) {}
			}			
		} catch (error) {}
	}
	
	var goalKey = route.params.goalKey;

	const today = new Date();

	const [sfCompleteDate, setSfCompleteDate] = useState<Date | null | undefined>(null)
	const [sfSubGoal, setSfSubGoal] = useState<string>("");
	const [sfReward, setSfReward] = useState<string>("");
	const [subGoalID, setSubGoalID] = useState<number>(route.params.subGoalID);

	const [open, setOpen] = useState(false);
	const {isLightTheme, setIsLightTheme} = useContext(ThemeContext);

	useFocusEffect(
		React.useCallback(() => {
			// console.log("Focused home screen");

			if (subGoalID != 0){
				const promiseGoal = new Promise((resolve, reject) => {
					resolve(getGoalData(goalKey));
				})

	
				Promise.all([promiseGoal]).then((values) => {
					var resGoalData = values[0];
	
					if (resGoalData != null){
						var goalData = resGoalData as GoalStruct;
						var subGoalList = goalData.subGoals; 
						var currentIndex = 0;

						for (var subGoalIndex = 0; subGoalIndex < subGoalList.length; subGoalIndex ++){
							if (subGoalList[subGoalIndex].subGoalID == subGoalID) {
								currentIndex = subGoalIndex;
							}
						}

						
						var subGoalItem = subGoalList[currentIndex];
						setSfSubGoal(subGoalItem.subGoal);
						setSfReward(subGoalItem.reward);
						setSfCompleteDate(subGoalItem.completeDate);
					}
				})
			}
			
			// return () => console.log("Unfocused home screen");
		}, [])
	)

	return ( 
		<>
			<View style={{backgroundColor: (isLightTheme) ? LightTheme.bgColor : DarkTheme.bgColor, flex: 1}}>
				<View style={{backgroundColor: (isLightTheme) ? LightTheme.bgSecColor : DarkTheme.bgSecColor, flexDirection: "row", alignContent: "center", justifyContent: "space-between", padding: 15}}>
					<Pressable style={{flexDirection: "row", alignItems: "center", gap: 7}} onPress={() => navigation.navigate("SubGoals")}>
						<LeftArrow color={(isLightTheme) ? LightTheme.textColor : DarkTheme.textColor} width={9} height={15} lineWidth={2} />
						<Text style={{fontFamily: AllTheme.fontFamilyBold, color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor}}>
							{(subGoalID != 0) ? "Edit SubGoal" : "New SubGoal"}
						</Text>
					</Pressable>
					{(subGoalID != 0) && ( 
						<View>
							<Pressable onPress={() => {deleteSubGoal(subGoalID)}}>
								<Text style={{fontFamily: AllTheme.fontFamilyBold, textAlign: "center", color: (isLightTheme) ? getColor("red")?.hexCodeLight : getColor("red")?.hexCodeDark}}>Delete SubGoal</Text>
							</Pressable>
						</View>
					)}
				</View>
				<View style={{backgroundColor: (isLightTheme) ? LightTheme.lineColor : DarkTheme.lineColor, height: 1.5}} />
					
				<View style={{flex: 1, padding: 15}}>
					<View style={{flex: 1, flexDirection: "column", gap: 30}}>
						<View>
							<Text style={[AllStyles.questionLabel, {color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor}]}>SubGoal *</Text>
							<TextInput defaultValue={sfSubGoal} onChangeText={text => setSfSubGoal(text)} style={[AllStyles.questionPrompt, {color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor,backgroundColor: (isLightTheme) ? LightTheme.bgSecColor : DarkTheme.bgSecColor}]} />
						</View>

						<View>
							<Text style={[AllStyles.questionLabel, {color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor}]}>Reward</Text>
							<TextInput defaultValue={sfReward} onChangeText={text => setSfReward(text)}  style={[AllStyles.questionPrompt, {color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor,backgroundColor: (isLightTheme) ? LightTheme.bgSecColor : DarkTheme.bgSecColor}]} />
						</View>

						<DatePicker 
							modal
							open={open}
							date={(() => {
								if (sfCompleteDate != null){
									return new Date(sfCompleteDate);
								} else {
									return today;
								}
							})()}
							mode="date"
							onConfirm={(date) => {
								setOpen(false)
								setSfCompleteDate(date);
							}}
							onCancel={() => {
							setOpen(false)
							}}
						/>

						<View>
							<Text style={[AllStyles.questionLabel, {color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor}]}>Completed Date</Text>
							<Pressable 
							style={[AllStyles.questionDateContainer, {backgroundColor: (isLightTheme) ? LightTheme.bgSecColor : DarkTheme.bgSecColor}]}
							onPress={() => {setOpen(true);}}>
								<View style={[AllStyles.questionDateButton, {height: 40, width: 40, borderColor: (isLightTheme) ? LightTheme.bgSecColor : DarkTheme.bgSecColor, borderWidth: 2, borderRadius: 5}]}>
									<Clock height={15} width={15} />
								</View>
								<Text style={[AllStyles.questionDateInput, {fontFamily: AllTheme.fontFamilyReg, color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor}]}>
									{getDateString(sfCompleteDate)}
								</Text>
							</Pressable>

							<View style={{justifyContent: "flex-start", flexDirection: "row", marginTop: 10}}>
								<Pressable onPress={() => {setSfCompleteDate(null)}} style={{paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, borderWidth: 1, borderColor: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor}}>
									<Text style={{fontFamily: AllTheme.fontFamilyReg, color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor}}>Reset Date</Text>
								</Pressable>
							</View>
						</View>
					</View>
				</View>
				
				<View style={{backgroundColor: (isLightTheme) ? LightTheme.lineColor : DarkTheme.lineColor, height: 1.5}} />
				<View style={{backgroundColor: (isLightTheme) ? LightTheme.bgSecColor : DarkTheme.bgSecColor, flexDirection: "row", gap: 15, justifyContent: "space-between", alignContent: "center", padding: 15}}>
					<View style={{flexDirection: "row", flex: 3}}>
						<Pressable 
						onPress={saveSubGoal}
						disabled={sfSubGoal.length == 0}
						style={{opacity: (sfSubGoal.length == 0) ? .5 : 1, backgroundColor: AllTheme.orange, flex: 1, borderRadius: 5, padding: 10}}>
							<Text style={[{fontFamily: AllTheme.fontFamilyReg, color: DarkTheme.textColor, textAlign: "center"}]} >
								Save
							</Text>
						</Pressable>
					</View>
				</View>
			</View>
		</>
	)
}

export default SubGoal;