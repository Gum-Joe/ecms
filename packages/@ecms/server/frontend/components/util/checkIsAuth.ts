/**
 * Function to check if we are authenticated
 */
async function checkIsAuthenticated(): Promise<boolean> {
	// 1: Check we are actually logged in
	const checkLoggedIn = await fetch("/api/user/current");
	if (checkLoggedIn.status === 401) {
		console.debug("Not logged in!");
		return false;
	} else if (checkLoggedIn.status >= 500) {
		console.debug("Server encountered an error checking if logged in!");
		// TODO: Return JSON message
		const errorText = await checkLoggedIn.text();
		throw new Error(
			`Server error, HTTP Status Code ${checkLoggedIn.status}: ${errorText}`
		);
	} else {
		return true;
	}
}

export default checkIsAuthenticated;