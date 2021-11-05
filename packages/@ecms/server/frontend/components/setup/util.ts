import { useRouteMatch, useHistory } from "react-router-dom";

/**
 * Hook to redirect to a different setup
 */
export function useSetupRedirector() {
	let { path, url } = useRouteMatch();
	const history = useHistory();
	return (setupPage: string) => history.push(`${url}${setupPage}`);
}