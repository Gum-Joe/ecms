import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FlexBox from "../FlexBox";
import LoginContainer from "./LoginContainer";
import { faCircleNotch, faEdit, faTools } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import axios from "axios";
import useAsyncEffect from "use-async-effect";
import { LinkedNavigationListContainer, LinkedNavigationList } from "../LinkedNavList";

/**
 * Handles Post Login Actions, such as redirecting to the data entry or event management UI
 */
const PostLogin: React.FC = (props) => {

	const history = useHistory();
	const [canUseDataEntry, setcanUseDataEntry] = useState(false);
	const [canUseEventManagement, setcanUseEventManagement] = useState(false);
	const [errorState, seterrorState] = useState<Error | undefined>(undefined);

	useAsyncEffect(async () => {
		// 1: Check we are actually logged in
		const checkLoggedIn = await fetch("/api/user/current");
		if (checkLoggedIn.status === 401) {
			console.debug("Not logged in!");
			history.push("/");
			return;
		}

		// 2: Check if we can do data entry
		const req1 = axios.get<{ hasPermission: boolean }>("/api/user/current/checkRoles", {
			params: {
				rolesToCheck: ["root.event.entry"]
			}
		})
			.then(res => {
				if (!res.data) {
					return seterrorState(new Error("No response from server when checking roles."));
				}
				if (res.status !== 200) {
					return seterrorState(new Error(`Got response code ${res.status} when asking for roles!`));
				}
				console.debug("Setting state canUseDataEntry...");
				return setcanUseDataEntry(true);
			});

		// 2: Check if we can do event management
		const req2 = axios.get<{ hasPermission: boolean }>("/api/user/current/checkRoles", {
			params: {
				rolesToCheck: ["root.event.modify"]
			}
		})
			.then(res => {
				if (!res.data) {
					return seterrorState(new Error("No response from server when checking roles."));
				}
				if (res.status !== 200) {
					return seterrorState(new Error(`Got response code ${res.status} when asking for roles!`));
				}

				return setcanUseEventManagement(true);
			});
			
		return await Promise.all([
			req1,
			req2,
		]);
	});

	return (
		<LoginContainer>
			<FlexBox className="fill-height" direction="column">
				{
					!canUseDataEntry && !canUseEventManagement ?
						<>
							<h2 className="sub-header">Checking details</h2>
							<FontAwesomeIcon icon={faCircleNotch} spin={true} size={"5x"} />
						</>
						:
						<>
							<h2 className="sub-header">Where would you like to go?</h2><LinkedNavigationListContainer>
								{canUseEventManagement ? <LinkedNavigationList
									linkTo="/"
									icon={<FontAwesomeIcon icon={faTools} />}
									text="Event configurator" /> : null}
								{canUseDataEntry ? <LinkedNavigationList
									linkTo="/entry"
									icon={<FontAwesomeIcon icon={faEdit} />}
									text="Data Entry" /> : null}
							</LinkedNavigationListContainer>
						</>
				}	
				
			</FlexBox>
		</LoginContainer>
	);
};

export default PostLogin;