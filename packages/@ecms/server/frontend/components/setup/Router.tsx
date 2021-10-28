import React, { FunctionComponent } from "react";
import { Route, useRouteMatch } from "react-router-dom";
import BasicDetails from "./BasicDetails";
import SetupFrame from "./SetupFrame";

 
const SetupRouter: FunctionComponent = () => {
	// From https://reactrouter.com/web/example/nesting
	// "The `path` lets us build <Route> paths that are
	// relative to the parent route, while the `url` lets
	// us build relative links."
	const { path, url } = useRouteMatch();
	return (
		<Route exact path={path}>
			<BasicDetails />
		</Route>
	);
};
 
export default SetupRouter;