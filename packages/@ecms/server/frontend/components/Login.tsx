import React from "react";
import CHBBlurredBG from "./AcrylicBackground";
/// @ts-ignore
import googleSignIn from "../assets/google/btn_google_signin_dark_normal_web@2x.png";

/**
 * Root code for the Login Page - contains the entire login page
 */
export default class LoginPage extends React.Component {
	render() {
		return (
			<CHBBlurredBG>
				<div className="flexbox">
					<div className="login-container">
						<h1 className="title-header">ECMS</h1>
						<a><img src={googleSignIn} className="google-sign-in" /></a>
						<a className="ecms-link local-auth-activate">Use a username or password instead</a>
					</div>
				</div>
			</CHBBlurredBG>

		);
	}
}