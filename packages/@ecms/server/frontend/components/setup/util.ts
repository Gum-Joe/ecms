import { useRouteMatch, useHistory } from "react-router-dom";

/**
 * Hook to redirect to a different setup
 */
export function useSetupRedirector() {
	let { path, url } = useRouteMatch();
	const history = useHistory();
	return (setupPage: string) => history.push(`${url}${setupPage}`);
}

/**
 * Gets data from a dropdown created using FAST
 */
export function getDataFromDropDown(dropdownId: string): string | null | undefined {
	return document.getElementById(dropdownId)?.getElementsByClassName("ui-button__content")[0]?.textContent;
}