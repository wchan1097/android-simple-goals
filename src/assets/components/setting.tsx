import React from "react";
import Svg, {G, Circle, Path} from "react-native-svg";

interface SettingProps {
	"color": string
}

export const Setting = (props: SettingProps) => {
	return (
		<>
			<Svg width={"100%"} height={"100%"} viewBox="0 0 117.182 117.182">
				<G
					id="layer1">
					<Circle
					fill="none"
					stroke={props.color}
					strokeWidth="10"
					strokeLinecap="round"
					id="path15967"
					cx="58.591003"
					cy="58.590996"
					r="53.590996" />
					<G
					id="g18848"
					transform="translate(-2.3055409)">
					<Path
						fill="none"
						stroke={props.color}
						strokeWidth="15"
						strokeLinecap="round"
						strokeDasharray="none"
						strokeOpacity="1"
						d="M 36.586136,82.092689 C 48.125206,70.553619 59.66418,59.014645 71.203062,47.475764"/>
					<Path
						fill={props.color}
						fill-opacity="1"
						stroke="none"
						strokeWidth="10"
						strokeLinecap="round"
						strokeOpacity="1"
						d="m 67.100433,30.36527 a 15,15 0 0 0 -10e-7,21.213371 15,15 0 0 0 21.213006,-3.66e-4 15,15 0 0 0 3.882454,-14.488774 l -3.882456,3.882456 a 7.5,7.5 0 0 1 -10.606318,-2e-6 7.5,7.5 0 0 1 -3.67e-4,-10.606683 l 3.882456,-3.882456 A 15,15 0 0 0 67.100433,30.36527 Z" />
					</G>
				</G>
			</Svg>
		</>
	)
}