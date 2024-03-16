import React, { useContext } from 'react';
import {
	Text, 
	View,
	Pressable,
	ToastAndroid,
	Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// SVG imports
import { XIcon } from 'src/assets/components/x_icon';

// Custom Imports
import { LeftArrow } from 'src/assets/components/left_arrow';
import { AllTheme, DarkTheme, LightTheme } from 'src/constants/theme';
import { getColor } from 'src/functions';
import { ThemeContext } from 'src/context';

function SettingScreen({navigation}: {navigation: any}){

	async function updateTheme(theme: string){
		try {
			setIsLightTheme(theme == "light");
			await AsyncStorage.setItem("THEME", theme); 
			navigation.navigate("Settings");
		} catch(error) {}
	}

	async function clearAllGoals(){
		Alert.alert(
			"",
			"Do you want to remove all your goals? This will clear all completed and current goals. This is irreversible.",
			[
				{ text: "Cancel" },
				{ text: "Continue", onPress: async () => {
					try {
						const keys = await AsyncStorage.getAllKeys();
						var goalKeys = keys.filter(item => { return item.search(/^GOAL_[\d]*$/gm) == 0; });
			
						for (var goalKeyIndex = 0; goalKeyIndex < goalKeys.length; goalKeyIndex ++){
							await AsyncStorage.removeItem(goalKeys[goalKeyIndex]);
						}
			
						ToastAndroid.show("All your goals have been removed.", ToastAndroid.SHORT);
			
					} catch(error) {}
				}}
			]
		)
	}

	const {isLightTheme, setIsLightTheme } = useContext(ThemeContext);

	return (
		<View style={{flex: 1, backgroundColor: (isLightTheme == true) ? LightTheme.bgColor : DarkTheme.bgColor}}>
			<View style={{backgroundColor: (isLightTheme) ? LightTheme.bgSecColor : DarkTheme.bgSecColor, flexDirection: "row", alignContent: "center", padding: 15}}>
				<Pressable style={{flexDirection: "row", alignItems: "center", gap: 7}} onPress={() => navigation.goBack()}>
				<LeftArrow color={(isLightTheme) ? LightTheme.textColor : DarkTheme.textColor} width={9} height={15} lineWidth={2} />
					<Text style={{fontFamily: AllTheme.fontFamilyBold, color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor}}>Settings</Text>
				</Pressable>
			</View>
			<View style={{backgroundColor: (isLightTheme) ? LightTheme.lineColor : DarkTheme.lineColor, height: 1.5}} />
			<View style={{backgroundColor: (isLightTheme) ? LightTheme.bgSecColor : DarkTheme.bgSecColor, padding: 15}}>
				<Text style={{fontFamily: AllTheme.fontFamilyBold, color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor, marginBottom: 10}}>Theme Preference</Text>
				<View style={{flexDirection: "column", gap: 10}}>
					<Pressable onPress={() => updateTheme("light")}  style={{flexDirection: "row", gap: 5}}>
						<View style={{height: 20, width: 20, backgroundColor: (isLightTheme) ? LightTheme.bgSecColor : DarkTheme.bgSecColor, borderRadius: 100, borderWidth: 2, borderColor: AllTheme.orange,  alignItems: "center", justifyContent: "center"}}>
							{(isLightTheme) && (
								<XIcon width={10} color={(isLightTheme) ? LightTheme.textColor : DarkTheme.textColor} lineWidth={1} />
							)}
						</View>
						<Text style={{fontFamily: AllTheme.fontFamilyReg, color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor}}>Light</Text>
					</Pressable>
					<Pressable onPress={() => updateTheme("dark")}  style={{flexDirection: "row", gap: 5}}>
						<View style={{height: 20, width: 20, backgroundColor: (isLightTheme) ? LightTheme.bgSecColor : DarkTheme.bgSecColor, borderRadius: 100, borderWidth: 2, borderColor: AllTheme.orange,  alignItems: "center", justifyContent: "center"}}>
							{(isLightTheme == false) && (
								<XIcon width={10} color={(isLightTheme) ? LightTheme.textColor : DarkTheme.textColor} lineWidth={1} />
							)}
						</View>
						<Text style={{fontFamily: AllTheme.fontFamilyReg, color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor}}>Dark</Text>
					</Pressable>
				</View>
			</View>
			<View style={{backgroundColor: (isLightTheme) ? LightTheme.lineColor : DarkTheme.lineColor, height: 1.5}} />
			<Pressable 
			onPress={() => { clearAllGoals(); }}
			style={{padding: 15, backgroundColor: (isLightTheme) ? LightTheme.bgSecColor : DarkTheme.bgSecColor}}>
				<Text style={{fontFamily: AllTheme.fontFamilyReg, color: (isLightTheme) ? getColor("red")?.hexCodeLight : getColor("red")?.hexCodeDark}}>Clear All Goals</Text>
			</Pressable>
			<View style={{backgroundColor: (isLightTheme) ? LightTheme.lineColor : DarkTheme.lineColor, height: 1.5}} />
			<Pressable 
			onPress={() => {navigation.navigate("Tags")}}
			style={{padding: 15, backgroundColor: (isLightTheme) ? LightTheme.bgSecColor : DarkTheme.bgSecColor}}>
				<Text style={{fontFamily: AllTheme.fontFamilyReg, color: (isLightTheme) ? LightTheme.textColor : DarkTheme.textColor}}>Edit Tags</Text>
			</Pressable>
			<View style={{backgroundColor: (isLightTheme) ? LightTheme.lineColor : DarkTheme.lineColor, height: 1.5}} />
		</View>
	)
}

export default SettingScreen