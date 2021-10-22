import React from "react";
import CHBBlurredBG from "../AcrylicBackground";
import FlexBox from "../FlexBox";

/**
 * Container for login pages - wraps the elements to display with a background and a overlaid panel for inputs
 */
const LoginContainer: React.FC = (props) => {
	return (
		<CHBBlurredBG>
			<FlexBox>
				<div className="login-container">
					{props.children}
				</div>
			</FlexBox>
		</CHBBlurredBG>
	);
};

export default LoginContainer;