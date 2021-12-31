import React, { FunctionComponent } from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Matches from "./Matches";
import SetupRenderer from "./SetupRender";
import Teams from "./Teams";
import Competitors from "./competitors";
import Finalise from "./Finalise";
import Units from "./Units";
import { useAppSelector } from "../../util/hooks";
import SetupFrame, { SetupHeader } from "./SetupFrame";

 
const SetupRouter: FunctionComponent = () => {
	// From https://reactrouter.com/web/example/nesting
	// "The `path` lets us build <Route> paths that are
	// relative to the parent route, while the `url` lets
	// us build relative links."
	const { path, url } = useRouteMatch();
	const isError = useAppSelector(state => state.setup.error);
	
	if (isError) {
		return (
			<SetupFrame nextPage="/" id="setup-renderer">
				<SetupHeader>
					<h1>An error was encountered</h1>
					<h3>{isError.message || isError}</h3>
				</SetupHeader>
			</SetupFrame>
		);
	}

	return (
		
		<Switch>
			<Route exact path={path}>
				<SetupRenderer />
			</Route>
			<Route exact path={`${path}/teams`}>
				<Teams />
			</Route>
			<Route exact path={`${path}/matches`}>
				<Matches />
			</Route>
			<Route exact path={`${path}/competitors`}>
				<Competitors />
			</Route>
			<Route exact path={`${path}/units`}>
				<Units />
			</Route>
			<Route exact path={`${path}/end`}>
				<Finalise />
			</Route>
		</Switch>
		
	);
};
 
export default SetupRouter;