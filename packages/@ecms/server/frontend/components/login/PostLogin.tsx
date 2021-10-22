import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FlexBox from "../FlexBox";
import LoginContainer from "./LoginContainer";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

/**
 * Handles Post Login Actions, such as redirecting to the data entry or event management UI
 */
const PostLogin: React.FC = (props) => {
	return (
		<LoginContainer>
			<FlexBox className="fill-height" direction="column">
				<h2 className="sub-header">Checking details</h2>
				<FontAwesomeIcon icon={faCircleNotch} spin={true} size={"5x"} />
			</FlexBox>
		</LoginContainer>
	);
};

export default PostLogin;