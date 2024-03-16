import React from "react";
import Svg, {Path, G} from "react-native-svg";

interface CheckMarkProps {
	"color": string,
	"lineWidth": number
}

export const CheckMark = (props: CheckMarkProps) => {

	return (
		<>
			<Svg
			width="100%"
			height="100%"
			viewBox="0 0 117.1821 117.18211">
			<G
				id="layer1">
				<Path
				fill="none"
				stroke={props.color}
				strokeWidth="10.2"
				strokeOpacity="0"
				d="M 14.818975,73.972411 46.612751,107.66533 117.18211,0"
				id="path2478" />
				<Path
				fill="none"
				fill-opacity="1"
				stroke={props.color}
				strokeWidth={props.lineWidth}
				strokeOpacity="1"
				d="M 6.7256315,74.469812 34.903869,101.75737 109.30958,6.0221309"
				id="path4872" />
			</G>
			</Svg>



		</>
	)
}