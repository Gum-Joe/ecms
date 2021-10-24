import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import React from "react";
import LoginPage from "./login/Login";
import PostLogin from "./login/PostLogin";
import LoginError from "./login/LoginError";


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
			<Route exact path="/login/error" render={(props) => <LoginError {...props} />} />
		</Router>
	);
};

export default App;