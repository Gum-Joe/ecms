import { BrowserRouter as Router, Route } from "react-router-dom";
import React from "react";
import LoginPage from "./Login";


/**
 * The entry point of the ECMS SPA
 * 
 * Controlles routing, themeing
 * 
 * TODO: Grab if authenticated, then use a Redirect on /
 */
const App: React.FC = () =>  {
	return (
		<Router>
			<Route path="/">
				<LoginPage />
			</Route>
		</Router>
	);
};

export default App;