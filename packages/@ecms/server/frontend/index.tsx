/** Entry Point of React */
import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { hot } from "react-hot-loader";

// Import all of our SCSS
import "./scss/index.scss";

const AppHMR = hot(module)(App);

// Copied from https://github.com/Gum-Joe/isitweeka/blob/main/frontend/src/index.tsx (which was auto-genereated by Creact-React-App)
ReactDOM.render(
	<React.StrictMode>
		<AppHMR />
	</React.StrictMode>,
	document.getElementById("root"),
);