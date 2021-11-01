/** Entry Point of React */
import React from "react";
import ReactDOM from "react-dom";


// Import all of our SCSS
import "./scss/index.scss";

import App from "./components/App";
import { hot } from "react-hot-loader";
import { Provider } from "react-redux";
import { store } from "./reducers";


const AppHMR = hot(module)(App);

// Copied from https://github.com/Gum-Joe/isitweeka/blob/main/frontend/src/index.tsx (which was auto-genereated by Creact-React-App)
ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<AppHMR />
		</Provider>
	</React.StrictMode>,
	document.getElementById("root"),
);