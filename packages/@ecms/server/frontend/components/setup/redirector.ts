import { events_and_groups } from "@ecms/models";
import { SetupState } from "../../constants/interfaces";
import type { useSetupRedirector } from "./util";

/**
 * Redirects setup after basic details to the appropriate next page. Used by the Inherit component as well
 */
export default function setupInitalRedirect(
	setupObject: Omit<SetupState, "state">,
	setupRedirect: ReturnType<typeof useSetupRedirector>,
	setupType: events_and_groups["type"] | undefined,
): void {
	// Routing time!
	// Decide redirects

	// 1: if teams need to be set, let that occurs (unless inheritance from parent is selected, in which case copy in parent's teams?)
	if (setupObject.enable_teams && !setupObject.inheritance) {
		setupRedirect("/teams");
		return;
	}

	console.log(setupObject);
		
	// 2: Check event type info if an event - if the setting of matches is on, go to matches page
	// 2a: if the event type is individual performance, go to competitors
	// 2b: if neither of the above, go to finalising page (no other things to set)
	if (setupType === "event") {
		const dataTracked = setupObject?.event_settings?.data_tracked;
			
		if (dataTracked === "matches" && setupObject.enable_teams && !setupObject.inheritance) {
			// INVALID STATE - Teams need to be set to use matches!
			alert("Invalid parameters - teams need to be enabled to use matches.");
			return;
		} else if (dataTracked === "matches" && setupObject.enable_teams && setupObject.inheritance) {
			// INVALID STATE - Teams need to be set to use matches!
			setupRedirect("/matches");
			return;
		} else if (dataTracked === "individual") {
			setupRedirect("/competitors");
			return;
		} else {
			setupRedirect("/end");
			return;
		}
	}

	// 3: Finally, if this is a group or event and there are no teams to add allow competitors to be added 
	setupRedirect("/competitors");
}
