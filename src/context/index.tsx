import React, { useState, useContext, createContext, useMemo, SetStateAction, Dispatch } from 'react';

export const ThemeContext = React.createContext<{
	isLightTheme: boolean, 
	setIsLightTheme: Dispatch<SetStateAction<boolean>>
}>({
	isLightTheme: true,
	setIsLightTheme: () => {}
});

export const GoalContext = React.createContext<{
	goalKey: string,
	setGoalKey: Dispatch<SetStateAction<string>>	
}>({
	goalKey: "",
	setGoalKey: () => {}
})

