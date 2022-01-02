import { BrowserRouter as Router, Redirect, Route, Switch, useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";
import LoginPage from "./login/Login";
import PostLogin from "./login/PostLogin";
import LoginError from "./login/LoginError";
import checkIsAuthenticated from "../util/checkIsAuth";
import HomepageMain from "./main/Homepage";
import SetupRouter from "./setup/Router";
import { SETUP_BASE_ROUTE } from "./setup/util";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import DataEntry from "./entry";


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

const darkTheme = createTheme({
	palette: {
		mode: "dark",
	},
});

/**
 * The entry point of the ECMS SPA
 * 
 * Controlles routing, themeing
 * 
 * TODO: Grab if authenticated, then use a Redirect on /
 */
const App: React.FC = () =>  {
	return (
		<ThemeProvider theme={darkTheme}>
			<Router>
				<Route exact path="/">
					<ProtectedHomePage />
				</Route>

				<Route path="/entry">
					<DataEntry />
				</Route>

				<Route exact path="/login">
					<LoginPage />
				</Route>
				<Route exact path="/login/postlogin">
					<PostLogin />
				</Route>
				<Route exact path="/login/error" render={(props) => <LoginError {...props} />} />

				<Route path={`${SETUP_BASE_ROUTE}`}><SetupRouter /></Route>
			</Router>
		</ThemeProvider>
	);
};

export default App;