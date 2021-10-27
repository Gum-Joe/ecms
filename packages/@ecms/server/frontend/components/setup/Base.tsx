import React, { FunctionComponent } from "react";
import CHBBlurredBG from "../common/AcrylicBackground";
import FlexBox from "../common/FlexBox";

/**
 * Base Setup Components
 * Creates the surface upon which the Setup Forms are placed
 */
const SetupFrame: FunctionComponent = (props) => {
	return ( 
		<CHBBlurredBG>
			<FlexBox className="fill-height-viewport">
				<div className="setup-frame">
					{props.children}
				</div>
			</FlexBox>
		</CHBBlurredBG>
	);
};
 
export default SetupFrame;