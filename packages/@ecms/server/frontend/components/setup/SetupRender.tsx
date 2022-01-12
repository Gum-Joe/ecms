// A custom hook that builds on useLocation to parse
// the query string for you.
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { setupAction, SetupActionsList } from "../../actions/setup";
import updateSetup, { startSetup } from "../../actions/setup/updateSetup";
import { useAppDispatch, useAppSelector } from "../../util/hooks";
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
	const dispatch = useAppDispatch();
	const isError = useAppSelector(state => state.setup.error);
	const setupState = useAppSelector(state => state.setup.state);

	useEffect(() => {
		const typeToSetup: "event" | "group" = query.get("type") as any;
		const parentId: string | undefined = query.get("parentId") as any;
		if (!typeToSetup) {
			seterrorState(
				new Error("No type provided!")
			);
		} else {
			dispatch(startSetup(typeToSetup));
			if (parentId && parentId !== "undefined") {
				dispatch(updateSetup({ parent_id: parentId }));
			}
		}
	}, [dispatch, query]); // We don't want this to run on every render
	
	if (isError) {
		return (
			<SetupFrame nextPage="/" id="setup-renderer">
				<SetupHeader>
					<h1>An error was encountered</h1>
					<h3>{isError.message || isError}</h3>
					<h3>You may need to refresh to escape this error.</h3>
				</SetupHeader>
			</SetupFrame>
		);
	} else if (setupState === "pending") {
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