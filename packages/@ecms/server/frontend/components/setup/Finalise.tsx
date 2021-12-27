import React, { useEffect } from "react";
import SetupContainer from "./SetupContainer";
import SetupFrame from "./SetupFrame";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch } from "../../util/hooks";
import updateSetup from "../../actions/setup/updateSetup";

/**
 * Finished setup by uploading what's in the store to the server and asking the server to put into the DB
 */
const Finalise: React.FC = () => {
	const dispatch = useAppDispatch();
	useEffect(() => {
		// 1: run an upload
		dispatch(updateSetup({}));
		
	}, [dispatch]);

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