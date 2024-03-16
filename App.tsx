/**
 * 
 * Goal Tracker Mobile Application
 * Author: William Chan
 *
 * @format
 */

import React, { useState, useContext, createContext, useMemo, SetStateAction, Dispatch } from 'react';
import {
	SafeAreaView,
	StatusBar,
	Appearance
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import GoalScreen from 'src/screens/goal';
import HomeScreen from "src/screens/home";
import SettingScreen from "src/screens/settings";
import FilterScreen from "src/screens/filter";
import TagScreen from 'src/screens/tags';
import { ThemeContext } from 'src/context';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {

	function getTheme(){
		new Promise((resolve, reject) => {
			const getAsTheme = async () => {
				try {
					var asTheme = await AsyncStorage.getItem("THEME");
					var output = "";
					if (asTheme == null) await AsyncStorage.setItem("THEME", "system"); 
					else output = asTheme;
					return output;
				} catch(error) {}
			}
			var selectedTheme = getAsTheme();
			
			resolve(selectedTheme);
		}).then((value) => {
			if ((value == "dark") && (isLightTheme == true)) setIsLightTheme(false);
			else if ((value == "light") && (isLightTheme == false)) setIsLightTheme(true);
			else if ((value == "system")) setIsLightTheme(Appearance.getColorScheme() == "light");
		})
	}

	const [isLightTheme, setIsLightTheme] = useState<boolean>(true);
	const value = useMemo(
		() => ({isLightTheme, setIsLightTheme}), 
		[isLightTheme]
	)

	return (
		<>
			<ThemeContext.Provider value={value}>
				<SafeAreaView style={{flex: 1}}>
					{(isLightTheme) && (
						<StatusBar barStyle={"dark-content"} backgroundColor={"#FFFFFF"} />
					)}
					{(isLightTheme == false) && (
						<StatusBar barStyle={"light-content"} backgroundColor={"#292929"} />
					)}
					<NavigationContainer 
					onStateChange = {() => getTheme()}
					onReady={() => getTheme()}>
						<Stack.Navigator
						id='AppBarNav'
						screenOptions={{
							headerShown: false,
							animation: "none"
						}}>
							<Stack.Screen name="Home" component={HomeScreen}/>
							<Stack.Screen name="Goal" component={GoalScreen}/>
							<Stack.Screen name="Settings" component={SettingScreen}/>
							<Stack.Screen name="Filter" component={FilterScreen}/>
							<Stack.Screen name="Tags" component={TagScreen}/>
						</Stack.Navigator>
					</NavigationContainer>
				</SafeAreaView>
			</ThemeContext.Provider>
		</>
	);
}

export default App;