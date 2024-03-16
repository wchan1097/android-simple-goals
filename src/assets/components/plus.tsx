import React from "react";
import Svg, {Rect} from "react-native-svg";

interface PlusProps {
	"color": string,
	"width": number,
	"lineWidth": number
}

export const Plus = (props: PlusProps) => {

	const lineCornerRadius = props.lineWidth / 2;

	return (
		<>
			<Svg width={props.width} height={props.width}>
				<Rect y={(props.width / 2) - (props.lineWidth / 2)} fill={props.color} width={props.width} height={props.lineWidth} rx={lineCornerRadius} ry={lineCornerRadius}></Rect>
				<Rect x={(props.width / 2) - (props.lineWidth / 2)} fill={props.color} height={props.width} width={props.lineWidth} rx={lineCornerRadius} ry={lineCornerRadius}></Rect>
			</Svg>
		</>
	)
}