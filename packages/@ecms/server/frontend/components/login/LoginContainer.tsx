import React from "react";
import CHBBlurredBG from "../common/AcrylicBackground";
import FlexBox from "../common/FlexBox";

/**
 * Container for login pages - wraps the elements to display with a background and a overlaid panel for inputs
 */
const LoginContainer: React.FC = (props) => {
	return (
		<CHBBlurredBG>
			<FlexBox className="fill-height-viewport">
				<div className="login-container">
					{props.children}
				</div>
			</FlexBox>
		</CHBBlurredBG>
	);
};

export default LoginContainer;