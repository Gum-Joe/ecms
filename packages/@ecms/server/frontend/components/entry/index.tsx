import { Router } from "express";
import React, { FunctionComponent } from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import CHBBlurredBG from "../common/AcrylicBackground";
import BottomBar from "./BottomBar";
import DataEntryRenderer from "./DataEntryRenderer";
import List from "./List";

/**
 * Router for data entry code
 */
const DataEntry: React.FC = () => {
	// From https://reactrouter.com/web/example/nesting
	// "The `path` lets us build <Route> paths that are
	// relative to the parent route, while the `url` lets
	// us build relative links."
	const { path, url } = useRouteMatch();

	return (
		<Switch>
			<Route exact path={path}>
				<CHBBlurredBG className="entry-page">
					<List />
					<BottomBar />
				</CHBBlurredBG>
			</Route>

			<Route exact path={`${path}/:id`}>
				<DataEntryRenderer />
			</Route>
		</Switch>
		
	);
};

export default DataEntry;