import React, { useState, useContext } from 'react';
import {
	StyleSheet, 
	Text, 
	View,
	Pressable
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

// Custom Imports
import DefaultTags from 'src/constants/tag_list';
import GoalColors from 'src/constants/goal_colors';
import { LeftArrow } from 'src/assets/components/left_arrow';
import { FilterStruct } from 'src/interfaces';
import { AllTheme, DarkTheme, LightTheme } from 'src/constants/theme';
import { getColor } from 'src/functions';
import { ThemeContext } from 'src/context';
import { XIcon } from 'src/assets/components/x_icon';

function FilterScreen({navigation}: {navigation: any}){

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

	async function saveFilterOptions(){
		try {
			await AsyncStorage.setItem("FILTER_OPTIONS", JSON.stringify(sfFilterOptions));
			navigation.navigate("Home");
		} catch (error) {}
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

	const [sfFilterOptions, setSfFilterOptions] = useState<FilterStruct>({
		"colors": [],
		"tags": [],
		"sortBy": ""
	});
	const [sfAllTags, setSfAllTags] = useState<string[]>(DefaultTags);
	const {isLightTheme, setIsLightTheme } = useContext(ThemeContext);

	useFocusEffect(
		React.useCallback(() => {
			const promiseFilter = new Promise((resolve, reject) => {
				resolve(getFilterOptions());
			})

			const promiseTag = new Promise((resolve, reject) => {
				resolve(getTagList())
			})

			Promise.all([promiseFilter, promiseTag]).then((values) => {
				setSfFilterOptions(values[0] as FilterStruct);
				setSfAllTags(values[1] as string[]);
			})
		}, [])
	)

	return (
		<View style={{flex: 1, backgroundColor: (isLightTheme) ? LightTheme.bgColor : DarkTheme.bgColor}}>
			<View style={{backgroundColor: (isLightTheme) ? LightTheme.bgSecColor : DarkTheme.bgSecColor, flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 15}}>
				<View style={{flexDirection: "row", alignContent: "center"}}>
					<Pressable style={{flexDirection: "row", alignItems: "center", gap: 7}} onPress={() => navigation.goBack()}>
					<LeftArrow color={(isLightTheme) ? LightTheme.textColor : DarkTheme.textColor} width={9} height={15} lineWidth={2} />
						<Text style={{fontFamily: AllTheme.fontFamilyBold, color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor}}>Filter</Text>
					</Pressable>
				</View>
				<View>
					<Pressable onPress={() => { setSfFilterOptions({"colors": [], "sortBy": "", "tags": []}); }}>
						<Text style={{fontFamily: AllTheme.fontFamilyReg, textAlign: "center", color: (isLightTheme) ? getColor("red")?.hexCodeLight : getColor("red")?.hexCodeDark}}>Reset</Text>
					</Pressable>
				</View>
			</View>
			<View style={{backgroundColor: (isLightTheme) ? LightTheme.lineColor : DarkTheme.lineColor, height: 1.5}} />
			<View style={{flex: 1}}>
				<View style={{backgroundColor: (isLightTheme) ? LightTheme.bgSecColor : DarkTheme.bgSecColor, }}>
					<View style={{padding: 15}}>
						<Text style={[filterStyle.questionLabel, {color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor}]}>Sort By:</Text>
						<View>
							<Pressable
								onPress={() => {
									var newFilterOptions = {...sfFilterOptions}; 
									if (newFilterOptions.sortBy != "startDate") newFilterOptions.sortBy = "startDate";
									setSfFilterOptions(newFilterOptions);
								}}
								style={{flexDirection: "row", gap: 5, alignItems: "center"}}>
									<View style={{height: 20, width: 20, borderRadius: 100, borderWidth: 2, borderColor: AllTheme.orange, alignItems: "center", justifyContent: "center"}}>
										{(sfFilterOptions.sortBy == "startDate") && (
											<XIcon width={10} color={(isLightTheme) ? LightTheme.textColor : DarkTheme.textColor} lineWidth={1} />
										)}
									</View>
									<Text style={{fontFamily: AllTheme.fontFamilyReg, color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor}}>Start Date</Text>
							</Pressable>
							<Pressable
								onPress={() => {
									var newFilterOptions = {...sfFilterOptions}; 
									if (newFilterOptions.sortBy != "abc") newFilterOptions.sortBy = "abc";
									setSfFilterOptions(newFilterOptions);
								}}
								style={{flexDirection: "row", gap: 5, alignItems: "center", marginTop: 10}}>
									<View style={{height: 20, width: 20, borderRadius: 100, borderWidth: 2, borderColor: AllTheme.orange, alignItems: "center", justifyContent: "center"}}>
										{(sfFilterOptions.sortBy == "abc") && (
											<XIcon width={10} color={(isLightTheme) ? LightTheme.textColor : DarkTheme.textColor} lineWidth={1} />
										)}
									</View>
									<Text style={{fontFamily: AllTheme.fontFamilyReg, color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor}}>Alphabetical</Text>
							</Pressable>
						</View>
					</View>
					<View style={{backgroundColor: (isLightTheme) ? LightTheme.lineColor : DarkTheme.lineColor, height: 1.5, marginTop: .5}} />

					<View style={{backgroundColor: (isLightTheme) ? LightTheme.bgSecColor : DarkTheme.bgSecColor, padding: 15}}>
						<Text style={[filterStyle.questionLabel, {color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor}]}>Tags</Text>
						<View style={{flexDirection: "row", flexWrap: "wrap", gap: 5}}>
							{sfAllTags.map((allTag, allTagIndex) => {
								var pressedTextColor = (isLightTheme) ? DarkTheme.textColor : LightTheme.textColor; 
								var unpressedTextColor = (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor;
								var pressedBgColor = (isLightTheme) ? DarkTheme.bgSecColor : LightTheme.bgSecColor; 
								var unpressedBgColor = (isLightTheme) ? LightTheme.bgSecColor : DarkTheme.bgSecColor;

								return (
									<View key={allTagIndex}>
										<Pressable onPress={(event) => {
											var newFilterOptions = {...sfFilterOptions};
											var hasTag = newFilterOptions.tags.indexOf(allTag) == -1;  
											if (hasTag) newFilterOptions.tags.push(allTag);
											else newFilterOptions.tags.splice(newFilterOptions.tags.indexOf(allTag), 1);
											setSfFilterOptions(newFilterOptions);
										}} 
										style={
											(pressed) => [(sfFilterOptions.tags.indexOf(allTag) != -1) ? filterStyle.pillButtonFilled : filterStyle.pillButtonUnfilled, 
											{
												backgroundColor: (sfFilterOptions.tags.indexOf(allTag) != -1) ? pressedBgColor : unpressedBgColor,
												borderColor: (sfFilterOptions.tags.indexOf(allTag) != -1) ? pressedTextColor : unpressedTextColor
											}]}>
										{({ pressed }) => (
											<Text
											style={[{fontFamily: AllTheme.fontFamilyReg, color: sfFilterOptions.tags.indexOf(allTag) != -1 ? pressedTextColor : unpressedTextColor}]}>
												{allTag}
											</Text>
										)}
										</Pressable>
									</View>
								)
							})}

							{(sfAllTags.length == 0) && (
								<View>
									<Text style={{color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor}}>* No tags available. Tags can be added through the settings menu.</Text>
								</View>
							)}
						</View>
					</View>
					<View style={{backgroundColor: (isLightTheme) ? LightTheme.lineColor : DarkTheme.lineColor, height: 1.5, marginTop: .5}} />
					
					<View style={{backgroundColor: (isLightTheme) ? LightTheme.bgSecColor : DarkTheme.bgSecColor, padding: 15}}>
						<Text style={[filterStyle.questionLabel, {color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor}]}>Color *</Text>
						<View style={{flexDirection: "row", gap: 5, flexWrap: "wrap"}}>
							{(GoalColors.map((color, colorIndex) => {
								if (color.name == "white"){
									return (
										<Pressable onPress={() => {
											var newFilterOptions = {...sfFilterOptions};
											var hasColor = newFilterOptions.colors.indexOf(color.name) > -1; 
											if (hasColor == false) newFilterOptions.colors.push(color.name)
											else newFilterOptions.colors.splice(newFilterOptions.colors.indexOf(color.name), 1)
											setSfFilterOptions(newFilterOptions);
										}} key={colorIndex} style={{backgroundColor: (isLightTheme) ? color.hexCodeLight : color.hexCodeDark, height: 45, width: 45, borderRadius: 30, alignItems: "center", justifyContent: "center"}}>
											{(sfFilterOptions.colors.indexOf(color.name) > -1) && (
												<XIcon width={20} color={(!isLightTheme) ? LightTheme.textColor : DarkTheme.textColor} lineWidth={3} />
											)}
										</Pressable>
									)
								} else {
									return (
										<Pressable onPress={() => {
											var newFilterOptions = {...sfFilterOptions};
											var hasColor = newFilterOptions.colors.indexOf(color.name) > -1; 
											if (hasColor == false) newFilterOptions.colors.push(color.name)
											else newFilterOptions.colors.splice(newFilterOptions.colors.indexOf(color.name), 1)
											setSfFilterOptions(newFilterOptions);
										}} key={colorIndex} style={{backgroundColor: (isLightTheme) ? color.hexCodeLight : color.hexCodeDark, height: 45, width: 45, borderRadius: 30, alignItems: "center", justifyContent: "center"}}>
											{(sfFilterOptions.colors.indexOf(color.name) > -1) && (
												<XIcon width={20} color={(!isLightTheme) ? LightTheme.textColor : DarkTheme.textColor} lineWidth={3} />
											)}
										</Pressable>
									)
								}
							}))}
						</View>
					</View>
					<View style={{backgroundColor: (isLightTheme) ? LightTheme.lineColor : DarkTheme.lineColor, height: 1.5, marginTop: .5}} />
				</View>
			</View>
			<View style={{backgroundColor: (isLightTheme) ? LightTheme.lineColor : DarkTheme.lineColor, height: 1.5, marginTop: .5}} />
			<View style={{padding: 15, backgroundColor: (isLightTheme) ? LightTheme.bgSecColor : DarkTheme.bgSecColor}}>
				<Pressable style={[filterStyle.saveFilterButton]} onPress={() => saveFilterOptions()}>
					<Text style={{fontFamily: AllTheme.fontFamilyReg, color: DarkTheme.textColor}}>Save</Text>
				</Pressable>
			</View>
		</View>
	)
}

const filterStyle = StyleSheet.create({
	questionLabel: {
		fontSize: 16,
		marginBottom: 10,
		fontFamily: AllTheme.fontFamilyBold
	},
	questionPrompt: {
		backgroundColor: DarkTheme.textColor,
		borderRadius: 5,
		paddingHorizontal: 10,
		height: 40,
		color: "black",
	},
	pillButtonUnfilled: {
		borderRadius: 15, 
		paddingHorizontal: 10, 
		paddingVertical: 5, 
		borderWidth: 2
	},
	pillButtonFilled: {
		borderRadius: 15, 
		paddingHorizontal: 12, 
		paddingVertical: 7
	},
	saveFilterButton: {
		backgroundColor: AllTheme.orange, 
		flexDirection: "row", 
		gap: 5, 
		alignItems: "center", 
		justifyContent: "center", 
		paddingVertical: 10, 
		borderRadius: 5
	}
});

export default FilterScreen