// A custom hook that builds on useLocation to parse
// the query string for you.
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { setupAction, SetupActionsList } from "../../actions/setup";
import SetupContext from "../../contexts/SetupContext";
import BasicDetails from "./BasicDetails";
import SetupFrame, { SetupHeader } from "./SetupFrame";

// From https://reactrouter.com/web/example/query-parameters
function useQuery() {
	return new URLSearchParams(useLocation().search);
}

/**
 * Component to start setup process, telling the server setup has begun,
 */
const SetupRenderer: React.FC = (props) => {
	const query = useQuery();
	const history = useHistory();
	const [errorState, seterrorState] = useState<Error | null>(null);
	const [hasLoaded, sethasLoaded] = useState(false);

	// Grab our Setup Context
	const { state: setup, dispatch } = useContext(SetupContext);

	useEffect(() => {
		const typeToSetup: "event" | "group" = query.get("type") as any;
		if (!typeToSetup) {
			seterrorState(
				new Error("No type provided!")
			);
		} else {
			const a = setupAction(SetupActionsList.START_SETUP, { type: typeToSetup });
			dispatch(setupAction(SetupActionsList.START_SETUP, { type: typeToSetup }));
			sethasLoaded(true);
		}
	}, []); // We don't want this to run on every render
	
	if (!hasLoaded) {
		return (
			<SetupFrame nextPage="" noNextButton id="setup-renderer">
				<SetupHeader>
					<h1>Setup is starting...</h1>
				</SetupHeader>
			</SetupFrame>
		);
	} else {
		return (
			<BasicDetails />
		);
	}
	
};

export default SetupRenderer;