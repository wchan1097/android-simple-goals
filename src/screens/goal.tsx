import React, { useState, useContext, useMemo } from 'react';
import {
	View
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Custom Imports
import { AllTheme, DarkTheme, LightTheme } from 'src/constants/theme';
import { ThemeContext, GoalContext } from 'src/context';
import Main from './goals/main';
import SubGoals from './goals/subgoals';
import SubGoal from './goals/subgoal';

function GoalScreen({route, navigation}: {route: any, navigation: any}) {

	const {isLightTheme, setIsLightTheme} = useContext(ThemeContext);
	const Tab = createMaterialTopTabNavigator();

	const [goalKey, setGoalKey] = useState<string>(route.params.goalKey);
	const goalkeyValue = useMemo(
		() => ({goalKey, setGoalKey}),
		[goalKey]
	)

	const Stack = createNativeStackNavigator();

	return (
		<GoalContext.Provider value={goalkeyValue}>
			<View style={{flex: 1, backgroundColor: (isLightTheme) ? LightTheme.bgColor : DarkTheme.bgColor}}>
				<Stack.Navigator
				id='GoalStackNav'
				initialRouteName='Main'
				screenOptions={{
					headerShown: false,
					animation: "none"
				}}>
					<Stack.Screen name="Main" component={Main}/>
					<Stack.Screen name="SubGoals" component={SubGoals}/>
					<Stack.Screen name="SubGoal" component={SubGoal}/>
				</Stack.Navigator>
			</View>
		</GoalContext.Provider>
	)
}

export default GoalScreen;