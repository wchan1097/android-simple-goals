import React from "react";
import Svg, {Path, G} from "react-native-svg";

interface FilterProps {
	"color": string
}

export const Filter = (props: FilterProps) => {

	return (
		<>
			<Svg
				width="100%"
				height="100%"
				viewBox="0 0 117.182 117.182">
				<G
					id="layer1">
					<Path
					fill="none"
					stroke={props.color}
					strokeWidth="10"
					strokeLinecap="round"
					strokeDasharray="none"
					d="M 5.2110364,5 C 40.868261,5 76.525258,5 112.182,5"/>
					<Path
					fill="none"
					stroke={props.color}
					strokeWidth="9.99991"
					strokeLinecap="round"
					strokeDasharray="none"
					d="m 28.580277,31.795508 c 27.867446,0 55.734707,0 83.601763,0"/>
					<Path
					fill="none"
					stroke={props.color}
					strokeWidth="9.99996"
					strokeLinecap="round"
					strokeDasharray="none"
					d="m 75.152342,85.386501 c 12.343306,0 24.686527,0 37.029678,0"/>
					<Path
					fill="none"
					stroke={props.color}
					strokeWidth="9.99998"
					strokeLinecap="round"
					strokeDasharray="none"
					d="m 52.017447,58.590992 c 20.054983,0 40.109833,0 60.164563,0"/>
					<Path
					fill="none"
					stroke={props.color}
					strokeWidth="9.99994"
					strokeLinecap="round"
					strokeDasharray="none"
					d="m 97.117008,112.182 c 5.021712,0 10.043382,0 15.065022,0"/>
				</G>
			</Svg>

		</>
	)
}