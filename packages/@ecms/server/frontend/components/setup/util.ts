import { teamsInitializer } from "@ecms/models";
import { useRouteMatch, useHistory } from "react-router-dom";

export const SETUP_BASE_ROUTE = "/setup";

/**
 * Hook to redirect to a different setup
 */
export function useSetupRedirector() {
	const { path, url } = useRouteMatch();
	const history = useHistory();
	return (setupPage: string) => history.push(`${SETUP_BASE_ROUTE}${setupPage}`);
}

/**
 * Gets data from a dropdown created using FAST
 */
export function getDataFromDropDown(dropdownId: string): string | null | undefined {
	return document.getElementById(dropdownId)?.getElementsByClassName("ui-button__content")[0]?.textContent;
}

/**
 * Teams currently in staging, i.e. being set-up.
 * Needs translating to DB Team Schema
 */
export interface StagingTeam extends teamsInitializer {
	showPicker: boolean;
}
