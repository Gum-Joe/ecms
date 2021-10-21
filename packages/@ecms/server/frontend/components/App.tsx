import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import React from "react";
import LoginPage from "./Login";
import PostLogin from "./PostLogin";


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
			<Route exact path="/">
				<LoginPage />
			</Route>
			<Route exact path="/login/postlogin">
				<PostLogin />
			</Route>
		</Router>
	);
};

export default App;