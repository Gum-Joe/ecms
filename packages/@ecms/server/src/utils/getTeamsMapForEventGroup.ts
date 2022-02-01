import { teams, teamsId } from "@ecms/models";
import { connectToDBKnex } from "./db";
import followInheritance from "./followInheritance";
import createLogger from "./logger";

const logger = createLogger("teams:getTeamsMapForEventGroup");

/**
 * Retrieves a map of teams from an event or group
 * TODO: Follow inheritance!
 */
export async function getTeamsMapForEventGroup(eventID: string, knex: ReturnType<typeof connectToDBKnex>): Promise<Map<string, teamsId>> {
	logger.debug("Getting teams map...");
	const trueEventId = await followInheritance(eventID, knex);
	logger.debug(`Querying ${trueEventId.event_group_id}, worked out from ${eventID}...`);
	const teams = await knex
		.select("teams.team_id")
		.select<Pick<teams, "name" | "team_id">[]>("teams.name")
		.from("join_events_groups_teams")
		.where("join_events_groups_teams.event_group_id", trueEventId.event_group_id)
		.leftJoin("teams", "teams.team_id", "join_events_groups_teams.team_id");
	const teamsMap = new Map<string, teamsId>();
	teams.forEach((team) => teamsMap.set(team.name, team.team_id));
	return teamsMap;
}
