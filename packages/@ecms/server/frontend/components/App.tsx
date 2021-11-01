import { BrowserRouter as Router, Redirect, Route, Switch, useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";
import LoginPage from "./login/Login";
import PostLogin from "./login/PostLogin";
import LoginError from "./login/LoginError";
import checkIsAuthenticated from "../util/checkIsAuth";
import HomepageMain from "./main/Homepage";
import SetupRouter from "./setup/Router";


/**
 * Only load the homepage if logged in, else rediret to login
 */
const ProtectedHomePage: React.FC = (props) => {
	const history = useHistory();
	const [isAuthenticated, setisAuthenticated] = useState<boolean | null>(null);
	useEffect(() => {
		checkIsAuthenticated()
			.then(result => setisAuthenticated(result))
			.catch(error => {
				history.push("/login/error", {
					error: error,
				});
			});
	}, []);
	return (
		isAuthenticated === null ?
			null :
			isAuthenticated === false ?
				<Redirect to="/login" />
				:
				<HomepageMain />
	);
};

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
				<ProtectedHomePage />
			</Route>

			<Route exact path="/login">
				<LoginPage />
			</Route>
			<Route exact path="/login/postlogin">
				<PostLogin />
			</Route>
			<Route exact path="/login/error" render={(props) => <LoginError {...props} />} />

			<Route exact path="/setup"><SetupRouter /></Route>
		</Router>
	);
};

export default App;