import { events_and_groups, teams } from "@ecms/models";
import { ResEventInfo } from "@ecms/api/events";

/**
 * Helpful helper functions, used when fetching data from the API
 * @packageDocumentation
 */
export async function fetchJSONfromRoute<T>(route: string): Promise<T> {
	const res = await fetch(route);
	return res.json();
}

export function fetchTeams(eventId: string, setTeams: (teams: teams[]) => void): Promise<void> {
	return fetchJSONfromRoute<teams[]>(`/api/common/${eventId}/teams`)
		.then(data => setTeams(data))
		.catch((err) => {
			console.error(err);
		});
}

export function fetchEventGroupInfo(eventId: string, callback: (events_and_groups: events_and_groups) => void): Promise<void> {
	return fetchJSONfromRoute<events_and_groups>(`/api/common/${eventId}/info`)
		.then(data => callback(data))
		.catch((err) => {
			console.error(err);
		});
}

export function fetchEventOnlyInfo(eventId: string, callback: (event: ResEventInfo) => void): Promise<void> {
	return fetchJSONfromRoute<ResEventInfo>(`/api/events/${eventId}/info`)
		.then(data => callback(data))
		.catch((err) => {
			console.error(err);
		});
}