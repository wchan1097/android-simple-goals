import React from "react";
import Svg, {Polyline, Line} from "react-native-svg";

interface XIconProps {
	"color": string | undefined,
	"width": number,
	"lineWidth": number
}

export const XIcon = (props: XIconProps) => {
	return (
		<>
			<Svg width={props.width} height={props.width}>
				<Line x1={props.width * .1} y1={props.width * .1} x2={props.width * .9} y2={props.width * .9} strokeWidth={props.lineWidth} stroke={props.color} strokeLinecap="round"/>
				<Line x1={props.width * .1} y1={props.width * .9} x2={props.width * .9} y2={props.width * .1} strokeWidth={props.lineWidth} stroke={props.color} strokeLinecap="round"/>
			</Svg>
		</>
	)
}