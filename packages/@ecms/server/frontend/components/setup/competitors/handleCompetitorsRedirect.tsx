import { event_or_group, trackable_data } from "@ecms/models";

/**
 * Handles redirecting to the correct page after competitor setting have been set (& competitors uploaded)
 * @param eventOrGroup `type` field from state
 * @param eventType `data_tracked` field from state, event_only_settings
 * @param setupPage React Hook to handle the redirect
 */
export function handleCompetitorsRedirect(eventOrGroup: event_or_group | undefined, eventType: trackable_data | undefined, setupPage: (setupPage: string) => void): void {
	if (eventOrGroup === "event" && eventType === "individual") {
		// Need to set units
		setupPage("/units");
	} else {
		setupPage("/end");
	}
}
