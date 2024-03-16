import React, { useState, useRef, useContext } from 'react';
import {
	TextInput,
	Text, 
	View,
	Pressable,
	ToastAndroid,
	Alert
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

// SVG imports
import Clock from 'assets/svgs/clock.svg';

// Custom Imports
import GoalColors from 'src/constants/goal_colors';
import DefaultTags from 'src/constants/tag_list';
import { getDateString, getColor } from 'src/functions';
import { GoalStruct, SubGoalStruct } from 'src/interfaces/index';
import { AllTheme, DarkTheme, LightTheme } from 'src/constants/theme';
import { ThemeContext, GoalContext } from 'src/context';
import { XIcon } from 'src/assets/components/x_icon';
import AllStyles from 'src/constants/styles';
import { LeftArrow } from 'src/assets/components/left_arrow';

const Main = ({route, navigation}: {route: any, navigation: any}) => {

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

	async function saveGoal(status: string) {
		var errorMessage = "";
		if ((sfStartDate != undefined) && (sfEndDate != undefined)) {
			if (sfStartDate > sfEndDate) errorMessage = "The Start Date must be before the End Date."
		}

		setSfStatus(status);

		if (errorMessage.length == 0) {
			var newGoal: GoalStruct = {
				"goalID": sfGoalID,
				"goalKey": goalKey, 
				"goal": sfTitle,
				"startDate": sfStartDate,
				"endDate": sfEndDate,
				"motivation": sfMotivation,
				"subGoals": subGoalListRef.current,
				"tags": sfTags,
				"color": sfColor,
				"status": status,
				"addInfo": sfAddInfo
			}

			try {
				if (goalKey == "GOAL_0"){
					const keys = await AsyncStorage.getAllKeys();
					var totalGoals = 0; 
					for (var keyIndex = 0; keyIndex < keys.length; keyIndex ++){
						var goalReg = /GOAL_[\d]+/gm;
						if (goalReg.test(keys[keyIndex])) totalGoals ++; 
					}
					
					newGoal.goalID = totalGoals + 1;
					newGoal.goalKey = "GOAL_" + (newGoal.goalID);
					setGoalKey(newGoal.goalKey);
					setSfGoalID(newGoal.goalID);
					await AsyncStorage.setItem(`GOAL_${totalGoals + 1}`, JSON.stringify(newGoal));
					ToastAndroid.show("New goal has been added. Subgoals are now available.", ToastAndroid.SHORT)
				}
				else {
					await AsyncStorage.setItem(goalKey, JSON.stringify(newGoal));
					ToastAndroid.show("Goal changes have been saved.", ToastAndroid.SHORT);
				}
			} catch (error) {
				
			}
		}
		else {
			ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
		}
	}

	async function getTagList(){
		try {
			const asTagList = await AsyncStorage.getItem("TAG_LIST"); 
			var output = DefaultTags;
			if (asTagList == null) await AsyncStorage.setItem("TAG_LIST", JSON.stringify(output));
			else output = JSON.parse(asTagList);
			return output;
		} catch (error) {}
	}

	const today = Date.now();

	var predefinedEndDate = null;
	if ((route.params != undefined) && (route.params.endDate != undefined)) predefinedEndDate = new Date(route.params.endDate); 

	const {isLightTheme, setIsLightTheme } = useContext(ThemeContext);
	const {goalKey, setGoalKey} = useContext(GoalContext);

	const defaultGoalData: GoalStruct = {
		"goal": "",
		"startDate": new Date(today),
		"endDate": predefinedEndDate,
		"motivation": "",
		"tags": [],
		"subGoals": [],
		"color": GoalColors[0].name,
		"addInfo": "",
		"goalID": 0,
		"goalKey": goalKey,
		"status":  "active"
	}

	// Stateful variables. sf prefex means Stateful.
	const [sfTitle , setSfTitle] = useState<string>(defaultGoalData.goal);
	const [sfStartDate, setSfStartDate] = useState<Date>(defaultGoalData.startDate);
	const [sfEndDate, setSfEndDate] = useState<Date | null | undefined>(defaultGoalData.endDate);
	const [sfMotivation, setSfMotivation] = useState(defaultGoalData.motivation);
	const [sfTags, setSfTags] = useState<string[]>([]);
	const [sfColor, setSfColor] = useState<string>(defaultGoalData.color); 
	const [sfAddInfo, setSfAddInfo] = useState<string>(defaultGoalData.addInfo);
	const [sfStatus, setSfStatus] = useState(defaultGoalData.status);

	var subGoalListRef = useRef<SubGoalStruct[]>([]); 
	
	const [sfGoalID, setSfGoalID] = useState(0);

	const [tagList, setTagList] = useState<string[]>([]); 
	const [open, setOpen] = useState(false);

	var dateType = useRef(0);

	useFocusEffect(
		React.useCallback(() => {
			// console.log("Focused home screen");

			const promiseGoal = new Promise((resolve, reject) => {
				resolve(getGoalData(goalKey));
			})

			const promiseTag = new Promise((resolve, reject) => {
				resolve(getTagList())
			})

			Promise.all([promiseGoal, promiseTag]).then((values) => {
				var resTags = values[1]; 
				var resGoalData = values[0];

				setTagList(resTags as string[]);

				if (resGoalData != null){
					var GoalData = resGoalData as GoalStruct; 

					setSfTitle(GoalData.goal);  
					setSfStartDate(GoalData.startDate);
					setSfEndDate(GoalData.endDate);
					setSfMotivation(GoalData.motivation);
					setSfTags(GoalData.tags);
					setSfColor(GoalData.color);
					setSfAddInfo(GoalData.addInfo);
					setSfGoalID(GoalData.goalID);
					setSfStatus(GoalData.status);
					subGoalListRef.current = GoalData.subGoals;
				}
			})
			
			// return () => console.log("Unfocused home screen");
		}, [])
	)

	return (
		<>
			<View style={{ flex: 1, backgroundColor: (isLightTheme) ? LightTheme.bgColor : DarkTheme.bgColor}}>
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
						onPress={() => {}}
						style={{flex: 1, padding: 15}}>
							<Text style={{fontFamily: AllTheme.fontFamilyBold, textAlign: "center", color: AllTheme.orange}}>Main</Text>
						</Pressable>
						<Pressable
						onPress={() => { navigation.navigate("SubGoals", { goalKey: goalKey }); }}
						style={{flex: 1, padding: 15}}>
							<Text style={{fontFamily: AllTheme.fontFamilyReg, textAlign: "center", color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor}}>Subgoals</Text>
						</Pressable>
					</View>
					<View style={{marginTop: 1, backgroundColor: (isLightTheme) ? LightTheme.lineColor : DarkTheme.lineColor, height: 1.5}} />
				</View>
				<KeyboardAwareScrollView 
				style={{flex: 1}} 
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{flexGrow: 1}}>
					<View style={{flex: 1, padding: 15, gap:30}}>
						<View style={{flex: 1, flexDirection: "column", gap: 30}}>
							
							<View>
								<Text style={[AllStyles.questionLabel, {color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor}]}>Goal *</Text>
								<TextInput 
								style={[AllStyles.questionPrompt, {color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor,backgroundColor: (isLightTheme) ? LightTheme.bgSecColor : DarkTheme.bgSecColor}]} 
								onChangeText={text => setSfTitle(text)}
								defaultValue={sfTitle}/>
							</View>

							<DatePicker 
								modal
								open={open}
								date={(() => {
									if (dateType.current == 0) return new Date(today)
									else if (dateType.current == 1) return sfStartDate
									else {
										if (sfEndDate instanceof Date) {
											return sfEndDate
										}
										else return new Date(today)
									}
								})()}
								mode="date"
								onConfirm={(date) => {
									setOpen(false)								
									if (dateType.current == 1){
										setSfStartDate(date)
									} else if (dateType.current == 2){
										setSfEndDate(date)
									}
								}}
								onCancel={() => {
								setOpen(false)
								}}
							/>

							<View>
								<Text style={[AllStyles.questionLabel, {color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor}]}>Start Date *</Text>
								<Pressable 
								style={[AllStyles.questionDateContainer, {backgroundColor: (isLightTheme) ? LightTheme.bgSecColor : DarkTheme.bgSecColor}]}
								onPress={() => {setOpen(true); dateType.current = 1}}>
									<View style={[AllStyles.questionDateButton, {height: 40, width: 40, borderColor: (isLightTheme) ? LightTheme.bgSecColor : DarkTheme.bgSecColor, borderWidth: 2, borderRadius: 5}]}>
										<Clock height={15} width={15} />
									</View>
									<Text style={[AllStyles.questionDateInput, {fontFamily: AllTheme.fontFamilyReg, color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor}]}>
										{getDateString(sfStartDate)}
									</Text>
								</Pressable>
							</View>

							<View>
								<Text style={[AllStyles.questionLabel, {color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor}]}>End Date</Text>
								<Pressable 
								style={[AllStyles.questionDateContainer, {backgroundColor: (isLightTheme) ? LightTheme.bgSecColor : DarkTheme.bgSecColor}]}
								onPress={() => {setOpen(true);  dateType.current = 2}}>
									<View style={[AllStyles.questionDateButton, {height: 40, width: 40, borderColor: (isLightTheme) ? LightTheme.bgSecColor : DarkTheme.bgSecColor, borderWidth: 2, borderRadius: 5}]}>
										<Clock height={15} width={15} />
									</View>
									<Text style={[AllStyles.questionDateInput, {fontFamily: AllTheme.fontFamilyReg, backgroundColor: (isLightTheme) ? LightTheme.bgSecColor : DarkTheme.bgSecColor, color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor}]}>
										{(sfEndDate === null) ? <Text></Text> : getDateString(sfEndDate)}
									</Text>
								</Pressable>
							</View>
							
							<View>
								<Text style={[AllStyles.questionLabel, {color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor}]}>Motivation</Text>
								<TextInput 
								style={[AllStyles.questionTextArea, {paddingVertical: 10, color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor, backgroundColor: (isLightTheme) ? LightTheme.bgSecColor : DarkTheme.bgSecColor}]} 
								multiline={true} 
								numberOfLines={4} 
								textAlignVertical='top' 
								onChangeText={text => setSfMotivation(text)}
								defaultValue ={sfMotivation}/>
							</View>

							<View>
								<Text style={[AllStyles.questionLabel, {color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor}]}>Tags</Text>
								{(tagList.length > 0) && (
									<View style={{flexDirection: "row", flexWrap: "wrap", gap: 5}}>
										{tagList.map((tag, tagIndex) => {
											var pressedTextColor = (isLightTheme) ? DarkTheme.textColor : LightTheme.textColor; 
											var unpressedTextColor = (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor;
											var pressedBgColor = (isLightTheme) ? DarkTheme.bgSecColor : LightTheme.bgSecColor; 
											var unpressedBgColor = (isLightTheme) ? LightTheme.bgColor : DarkTheme.bgColor;
											return (
												<View key={tagIndex}>
													<Pressable onPress={(event) => {
														var newArr = [...sfTags]; 
														var hasTag = newArr.indexOf(tag) > -1;  
														if (hasTag == false) {
															newArr.push(tag);
														}
														else newArr.splice(newArr.indexOf(tag), 1);
														setSfTags(newArr);
													}} 
													style={(pressed) => [
														(sfTags.indexOf(tag) != -1) ? AllStyles.pillButtonFilled : AllStyles.pillButtonUnfilled, 
														{
															backgroundColor: (sfTags.indexOf(tag) != -1 && pressed) ? pressedBgColor : unpressedBgColor,
															borderColor: (sfTags.indexOf(tag) != -1) ? pressedTextColor : unpressedTextColor
														}]}>
													{({ pressed }) => (
														<Text
														style={[{fontFamily: AllTheme.fontFamilyReg, color: sfTags.indexOf(tag) != -1 ? pressedTextColor : unpressedTextColor}]}>
															{tag}
														</Text>
													)}
													</Pressable>
												</View>
											)
										})}
									</View>
								)}
							
								{(tagList.length === 0) && (
									<View>
										<Text style={{fontFamily: AllTheme.fontFamilyReg, color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor}}>
											* No tags available. Tags can be added through the settings menu.
										</Text>
									</View>
								)}
							</View>

							<View>
								<Text style={[AllStyles.questionLabel, {color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor}]}>Color *</Text>
								<View style={{flexDirection: "row", gap: 5, flexWrap: "wrap"}}>
									{(GoalColors.map((color, colorIndex) => {
										return (
											<Pressable onPress={() => {setSfColor(color.name)}} key={colorIndex} style={{backgroundColor: (isLightTheme) ? color.hexCodeLight : color.hexCodeDark, height: 45, width: 45, borderRadius: 30, alignItems: "center", justifyContent: "center"}}>
												{(sfColor == color.name) && (
													<XIcon width={20} color={(!isLightTheme) ? LightTheme.textColor : DarkTheme.textColor} lineWidth={3} />
												)}
											</Pressable>
										)
									}))}
								</View>
							</View>

							<View>
								<Text style={[AllStyles.questionLabel, {color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor}]}>Additional Information</Text>
								<TextInput 
								style={[AllStyles.questionTextArea, {paddingVertical: 10, color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor, backgroundColor: (isLightTheme) ? LightTheme.bgSecColor : DarkTheme.bgSecColor}]} 
								multiline={true} 
								numberOfLines={4} 
								textAlignVertical='top' 
								onChangeText={text => setSfAddInfo(text)}
								defaultValue ={sfAddInfo}/>
							</View>
						</View>
					</View>
				</KeyboardAwareScrollView>

				<View style={{backgroundColor: (isLightTheme) ? LightTheme.lineColor : DarkTheme.lineColor, height: 1.5}} />
				<View style={{backgroundColor: (isLightTheme) ? LightTheme.bgSecColor : DarkTheme.bgSecColor, flexDirection: "row", gap: 15, justifyContent: "space-between", alignContent: "center", padding: 15}}>
					<View style={{flexDirection: "row", flex: 3, justifyContent: (sfGoalID != 0) ? "flex-end" : "flex-start"}}>
						<Pressable 
						disabled={sfTitle.length == 0} 
						style={{backgroundColor: AllTheme.orange, flex: 1, borderRadius: 5, padding: 10, opacity: sfTitle.length == 0 ? .5 : 1}} onPress={() => {saveGoal(sfStatus);}} >
							<Text style={[{fontFamily: AllTheme.fontFamilyReg,color: DarkTheme.textColor, textAlign: "center"}]} >
								{(sfGoalID == 0) ? "Create" : "Save"}
							</Text>
						</Pressable>
					</View>
					{(goalKey != "GOAL_0") && (
						<View style={{flex: 2, flexDirection: "row", justifyContent: "center"}}>
							<Pressable style={{borderColor: AllTheme.orange,  borderWidth: 2, flex: 1, borderRadius: 5, padding: 8}} 
							onPress={() => {
								if (sfStatus == "active") saveGoal("complete")	
								else if (sfStatus == "complete") saveGoal("active")
							}}>
								<Text style={{fontFamily: AllTheme.fontFamilyReg, color: AllTheme.orange, textAlign: "center"}}>
									{(sfStatus == "complete") ? "Continue" : "Complete"}
								</Text>
							</Pressable>
						</View>
					)}
				</View>
			</View>
		</>
	)
}

export default Main;