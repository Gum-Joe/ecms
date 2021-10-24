import React from "react";
import LoginContainer from "./LoginContainer";
import type { History } from "history";

/**
 * Use this to handle server error/request errors when logging in.
 */
const LoginError: React.FC<{ history: History }> = (props) => {
	let errorToShow = (props?.history?.location as any)?.error;
	if (!errorToShow || !(errorToShow instanceof Error)) {
		errorToShow = new Error("An error was encountered.");
	}
	return (
		<LoginContainer>
			<h2>Error!</h2>
			<p>
				{errorToShow.message}
			</p>
		</LoginContainer>
	);
};

export default LoginError;