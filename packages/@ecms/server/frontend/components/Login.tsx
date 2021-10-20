import React from "react";
import CHBBlurredBG from "./AcrylicBackground";

import googleSignIn from "../assets/google/btn_google_signin_dark_normal_web@2x.png";
import Button from "./Button";
import FlexBox from "./FlexBox";
import Form from "./Form";

/**
 * Root code for the Login Page - contains the entire login page
 */
export default class LoginPage extends React.Component {

	componentDidMount() {
		// Dynamically changes contents of gsignin button:
		
	}

	render() {
		return (
			<CHBBlurredBG>
				<FlexBox>
					<div className="login-container">
						<h1 className="title-header">ECMS</h1>
						<a href="/api/user/login/google"><img src={googleSignIn} className="google-sign-in" id="google-sign-in"/></a>
						<a className="ecms-link local-auth-activate">Use a username or password instead</a>

						<div className="login-form">
							<Form action="/api/user/login/local" method="POST">
								<div>
									<label htmlFor="email">Email</label>
									<input required={true} name="email" id="login-email" type="email" placeholder="someone@example.com" />
								</div>
								<div>
									<label htmlFor="password">Password</label>
									<input required={true} name="password" id="login-password" type="password" placeholder="Password" />
								</div>
								<FlexBox>
									<Button buttonType="primary">Login</Button>
								</FlexBox>
							</Form>
						</div>
					</div>
				</FlexBox>
			</CHBBlurredBG>

		);
	}
}