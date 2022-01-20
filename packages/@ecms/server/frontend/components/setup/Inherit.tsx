/**
 * Handles scaffolding the setup state with info from the inherited group
 */
import { events_and_groups, teams } from "@ecms/models";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect } from "react";
import useAsyncEffect from "use-async-effect";
import SetupActionsList, { setupAction } from "../../actions/setup";
import updateSetup from "../../actions/setup/updateSetup";
import { useAppDispatch, useAppSelector } from "../../util/hooks";
import setupInitalRedirect from "./redirector";
import SetupContainer from "./SetupContainer";
import SetupFrame from "./SetupFrame";
import { useSetupRedirector } from "./util";

const Inherit: React.FC = (props) => {

	const parent_id = useAppSelector(state => state.setup.parent_id);
	const fullState = useAppSelector(state => state.setup);
	const dispatch = useAppDispatch();

	const setupPage = useSetupRedirector();

	useAsyncEffect(async (isActive) => {
		if (!parent_id) {
			return dispatch(setupAction(SetupActionsList.SETUP_FAILED, new Error("No parent group ID specified to inherit from.")));
		}

		// 1: Check event is of right type (by GitHub Copilot)
		const parent = (await axios.get<events_and_groups>(`/api/common/${parent_id}/info`)).data;
		if (parent?.type !== "group") {
			return dispatch(setupAction(SetupActionsList.SETUP_FAILED, new Error(`ID to inherit from is not a group! Got a ${theType} instead.`)));
		}

		// 2: Get teams
		if (parent?.enable_teams) {
			const teams = (await axios.get<teams[]>(`/api/common/${parent_id}/teams`)).data;
			const newState = {
				teams: teams,
				enable_teams: true,
			};
			// Set teams
			await dispatch(updateSetup(newState));

			// Redirect
			return setupInitalRedirect({ ...fullState, ...newState }, setupPage, fullState.type);

		}
		

		// Done, redirect
	}, []);

	return (
		<SetupFrame>
			<SetupContainer className="setup-end-container">
				<div className="central-progress-box">
					<h1>Please wait...</h1>
					<h2>Setup is retrieving information from the parent event...</h2>
					<FontAwesomeIcon icon={faCircleNotch} spin={true} size={"8x"} />
				</div>
			</SetupContainer>
		</SetupFrame>
	);
};

export default Inherit;