/** Entry Point of React */
import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

// Import all of our SCSS
import "./scss/index.scss";

// Copied from https://github.com/Gum-Joe/isitweeka/blob/main/frontend/src/index.tsx (which was auto-genereated by Creact-React-App)
ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById("root"),
);