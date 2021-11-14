import React, { FunctionComponent } from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Matches from "./Matches";
import SetupRenderer from "./SetupRender";
import Teams from "./Teams";
import Competitors from "./competitors";

 
const SetupRouter: FunctionComponent = () => {
	// From https://reactrouter.com/web/example/nesting
	// "The `path` lets us build <Route> paths that are
	// relative to the parent route, while the `url` lets
	// us build relative links."
	const { path, url } = useRouteMatch();
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
		</Switch>
		
	);
};
 
export default SetupRouter;