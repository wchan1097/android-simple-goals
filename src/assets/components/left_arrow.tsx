import React from "react";
import Svg, {Polyline} from "react-native-svg";

interface LeftArrowProps {
	"color": string,
	"width": number,
	"height": number,
	"lineWidth": number
}

export const LeftArrow = (props: LeftArrowProps) => {

	const points = `${props.width - props.lineWidth},${props.lineWidth} ${props.lineWidth},${props.height / 2} ${props.width - props.lineWidth},${props.height - props.lineWidth}`;
	

	return (
		<>
			<Svg width={props.width} height={props.height}>
				<Polyline
				points={points} 
				fill="none"
				strokeWidth={props.lineWidth}
				stroke={props.color}
				strokeLinecap="round"
				/>
			</Svg>
		</>
	)
}