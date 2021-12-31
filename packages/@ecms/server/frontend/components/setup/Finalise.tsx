import React, { useEffect } from "react";
import axois from "axios";
import SetupContainer from "./SetupContainer";
import SetupFrame from "./SetupFrame";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "../../util/hooks";
import endSetup from "../../actions/setup/endSetup";
import updateSetup from "../../actions/setup/updateSetup";
import axios from "axios";
import { APIMessage } from "@ecms/api/common";
import { ResSetupStatus } from "@ecms/api/setup";
import { useHistory } from "react-router-dom";
import SetupActionsList, { setupAction } from "../../actions/setup";

/**
 * Finished setup by uploading what's in the store to the server and asking the server to put into the DB
 */
const Finalise: React.FC = () => {
	const dispatch = useAppDispatch();
	const setupID = useAppSelector(state => state.setup.setupID);
	const history = useHistory();
	useEffect(() => {
		// 1: run an upload
		dispatch(updateSetup({}));

		// 2: request end of setup
		dispatch(endSetup());

		// 3: set Intevral & ping. Check every 5 secs
		const intervalID = setInterval(async () => {
			try {
				const status = (await axios.get<ResSetupStatus | APIMessage>("/api/setup/state/" + setupID)).data;
				if ("status" in status) {
					if (status.status === "done") {
						// Done!
						// Redirect to event page
						history.push("/");
					} else if (status.status === "error") {
						// Set error state
						dispatch(setupAction(SetupActionsList.SETUP_FAILED, new Error(status.error || "Unknown error")));
					}
				} else {
				// Set error state!
					dispatch(setupAction(SetupActionsList.SETUP_FAILED, new Error(status.message || "No error message from the server receieved")));
				}
			} catch (err) {
				dispatch(setupAction(SetupActionsList.SETUP_FAILED, err));
			}
			
			
		}, 5 * 1000);

		// From https://sebhastian.com/setinterval-react/
		return () => clearInterval(intervalID);
	}, [dispatch, history, setupID]);

	return (
		<SetupFrame nextPage="/">
			<SetupContainer id="setup-end" className="setup-end-container">
				<div className="central-progress-box">
					<h1>Finalising...</h1>
					<FontAwesomeIcon icon={faCircleNotch} spin={true} size={"8x"} />
				</div>
			</SetupContainer>
		</SetupFrame>
	);
};

export default Finalise;