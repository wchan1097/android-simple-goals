import { StyleSheet } from "react-native";
import { AllTheme } from "./theme";

const AllStyles = StyleSheet.create({
	fontFamilyReg: {
		fontFamily: "Barlow Regular"
	},
	fontFamilyBold: {
		fontFamily: "Barlow Bold"
	},
	questionLabel: {
		fontSize: 16,
		marginBottom: 10,
		fontFamily: "Barlow Bold"
	},
	questionTextArea: {
		borderRadius: 5,
		paddingHorizontal: 10
	},
	questionPrompt: {
		borderRadius: 5,
		paddingHorizontal: 10,
		height: 40
	},
	subGoalPrompt: {
		borderTopRightRadius: 5,
		borderBottomRightRadius: 5,
		paddingHorizontal: 10,
		height: 40
	},
	questionDateInput: {
		height: 40, 
		paddingHorizontal: 10,
		textAlignVertical: "center", 
		flex: 1
	},
	questionDateButton: {
		backgroundColor: AllTheme.orange,
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row",
	},
	questionDateContainer: {
		flexDirection: "row",
		borderRadius: 5, 
		overflow: "hidden"
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
	}	
});

export default AllStyles;