import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FlexBox from "../FlexBox";
import LoginContainer from "./LoginContainer";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";

/**
 * Handles Post Login Actions, such as redirecting to the data entry or event management UI
 */
const PostLogin: React.FC = (props) => {

	const history = useHistory();

	useEffect(() => {
		fetch("/api/user/current")
			.then(res => {
				if (res.status === 401) {
					console.debug("Not logged in!");
					history.push("/");
					throw new Error("Not logged in");
				} else {
					// Logged in! Check permissions
					return fetch("/api/user/current/check_perms");
				}
			})
			.then(res => {
				if (res.status !== 200) {
					console.error("Error fecthing roles from server!");
					history.push("/"); // Until we sort proper error handling
				}
			});
		
	}, []);

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