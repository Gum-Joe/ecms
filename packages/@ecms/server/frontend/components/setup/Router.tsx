import React, { FunctionComponent } from "react";
import { Route, useRouteMatch } from "react-router-dom";
import SetupRenderer from "./SetupRender";

 
const SetupRouter: FunctionComponent = () => {
	// From https://reactrouter.com/web/example/nesting
	// "The `path` lets us build <Route> paths that are
	// relative to the parent route, while the `url` lets
	// us build relative links."
	const { path, url } = useRouteMatch();
	return (
		<Route exact path={path}>
			<SetupRenderer />
		</Route>
	);
};
 
export default SetupRouter;