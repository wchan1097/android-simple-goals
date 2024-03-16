import React, { useState, useContext } from 'react';
import {
	ScrollView, 
	StyleSheet, 
	Text, 
	View,
	Pressable,
	Appearance,
	TextInput,
	ToastAndroid
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { LeftArrow } from 'src/assets/components/left_arrow';
import { LightTheme, DarkTheme, AllTheme } from 'src/constants/theme';
import GoalColors from 'src/constants/goal_colors';
import { getColor } from 'src/functions';
import { ThemeContext } from 'src/context';
import AllStyles from 'src/constants/styles';
import DefaultTags from 'src/constants/tag_list';
import { XIcon } from 'src/assets/components/x_icon';
import { Plus } from 'src/assets/components/plus';
import { CheckMark } from 'src/assets/components/check_mark';

function TagScreen({navigation}: {navigation: any}) {

	async function saveTagList(){
		var cleanTagList = [...tagList].map((item) => item.trim()).filter((item) => item.length > 0);
		await AsyncStorage.setItem("TAG_LIST", JSON.stringify(cleanTagList));
		ToastAndroid.show("Your tags have been saved.", ToastAndroid.SHORT);
	}

	const [tagList, setTagList] = useState<string[]>([])

	const {isLightTheme, setIsLightTheme} = useContext(ThemeContext);

	useFocusEffect(
		React.useCallback(() => {
			(async () => {
				var getCurrentTags = await AsyncStorage.getItem("TAG_LIST");
				setTagList((getCurrentTags == null) ? DefaultTags : JSON.parse(getCurrentTags));
			})();
		}, [])
	)

	return (
		<View style={{flex: 1, backgroundColor: (isLightTheme == true) ? LightTheme.bgColor : DarkTheme.bgColor}}>
			<View style={{backgroundColor: (isLightTheme) ? LightTheme.bgSecColor : DarkTheme.bgSecColor, flexDirection: "row", alignContent: "center", padding: 15}}>
				<Pressable style={{flexDirection: "row", alignItems: "center", gap: 7}} onPress={() => navigation.goBack()}>
				<LeftArrow color={(isLightTheme) ? LightTheme.textColor : DarkTheme.textColor} width={9} height={15} lineWidth={2} />
					<Text style={{fontFamily: AllTheme.fontFamilyBold, color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor}}>Tags</Text>
				</Pressable>
			</View>
			<View style={{backgroundColor: (isLightTheme) ? LightTheme.lineColor : DarkTheme.lineColor, height: 1.5}} />
			<KeyboardAwareScrollView 
				style={{flex: 1}} 
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{flexGrow: 1}}>
			
				<View style={{padding: 15}}>

					<View style={{flexDirection: "row", alignItems: "flex-start", marginBottom: 30, justifyContent: "space-between"}}>
						<Pressable 
						onPress={() => { setTagList([...tagList, ""]); }}
						style={{flexGrow: 0, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 5, borderWidth: 2, borderColor: AllTheme.orange, flexDirection: "row", alignItems: "center", gap: 5}}>
							<Plus 
							color={(isLightTheme) ? LightTheme.textColor : DarkTheme.textColor}
							lineWidth={2}
							width={15}
							/>
							<Text style={{fontFamily: AllTheme.fontFamilyReg, color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor}}>Insert New Tag</Text>
						</Pressable>

						<Pressable 
						onPress={()=> {saveTagList()}}
						style={{flexGrow: 0, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, backgroundColor: AllTheme.orange, flexDirection: "row", alignItems: "center", gap: 5}}>
							<View style={{width: 12, height: 12}}>
								<CheckMark color={DarkTheme.textColor} lineWidth={20} />
							</View>
							<Text style={{fontFamily: AllTheme.fontFamilyReg, color: DarkTheme.textColor}}>Save</Text>
						</Pressable>
					</View>

					<Text style={{fontFamily: AllTheme.fontFamilyReg, textAlign: "center", marginBottom: 15, color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor}}>Your Tags</Text>

					{(tagList.length > 0) && (
						<View style={{gap: 15}}>
							{ tagList.map((tagItem, tagIndex) => {
								return (
									<View key={tagIndex} style={{flexDirection: "row", gap: 10}}>
										<View style={{flexGrow: 1}}>
											<TextInput 
											maxLength={20}
											onChangeText={(text) => {
												var copyTagList = [...tagList]; 
												copyTagList[tagIndex] = text; 
												setTagList(copyTagList);
											}}
											defaultValue={tagItem}
											style={[AllStyles.questionPrompt, {color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor, backgroundColor: (isLightTheme) ? LightTheme.bgSecColor : DarkTheme.bgSecColor}]}
											/>
										</View>
										<Pressable 
										onPress={() => {
											var copyTagList = [...tagList];
											copyTagList.splice(tagIndex, 1); 
											setTagList(copyTagList);
										}}
										style={{borderRadius: 5, borderWidth: 2, flexDirection: "row", alignItems: "center", paddingHorizontal: 15, borderColor: (isLightTheme) ? getColor("red")?.hexCodeLight : getColor("red")?.hexCodeDark}}>
											<XIcon 
											width={15} 
											color={(isLightTheme) ? getColor("red")?.hexCodeLight : getColor("red")?.hexCodeDark} 
											lineWidth={2} />
										</Pressable>
									</View>
								)
							})}
						</View>
					)}
					
					{(tagList.length === 0) && (
						<View>
							<Text style={{fontFamily: AllTheme.fontFamilyReg, textAlign: "center" ,color: (isLightTheme) ? (LightTheme.textColor) : (DarkTheme.textColor)}}>No tags available.</Text>
						</View>
					)}
				</View>
			</KeyboardAwareScrollView>
		</View>
	)
}

export default TagScreen;