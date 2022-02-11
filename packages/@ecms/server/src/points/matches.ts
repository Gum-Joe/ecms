import createLogger from "../utils/logger";
import { connectToDBKnex } from "../utils/db";
import { PointsMatches } from "@ecms/api/points";
import { events_and_groupsId, matches } from "@ecms/models";
import { match } from "assert";

const logger = createLogger("points:matches");

/**
 * Matches scoring system
 * @returns `Map<string, number` of team UUIDs to points
 */
export default async function scoreMatches(event_id: events_and_groupsId, knex: ReturnType<typeof connectToDBKnex>, settings: PointsMatches) {
	logger.info(`Calculating match points for event ${event_id}`);

	// 1: Query matches
	logger.debug("Getting match results...");
	const matchesQuery = await knex
		.select<matches[]>("*")
		.from("matches")
		.where("parent_event", event_id);
	
	// Loop
	// Map of team UUIDs to points
	const results = new Map<string, number>();
	matchesQuery.forEach((theMatch, index) => {
		// Case 1: Team 1 wins
		logger.debug(`Processing match ${index + 1}/${matchesQuery.length} id ${theMatch.match_id}`)
		if (theMatch.team_1_score === null || theMatch.team_2_score === null) {
			logger.warn(`Skipping match ${theMatch.match_id} as some scores missing`);
			return;
		}

		if (theMatch.team_1_score > theMatch.team_2_score) {
			logger.debug(`Team ${theMatch.team_1} wins match ${index + 1}/${matchesQuery.length}`);
			const currentPointsWinner = results.get(theMatch.team_1);
			results.set(theMatch.team_1, (currentPointsWinner ?? 0) + settings.win);
			logger.debug(`Awarded ${theMatch.team_1} ${settings.win} points for ${results.get(theMatch.team_1)} points total`);
			const currentPointsLoser = results.get(theMatch.team_2);
			results.set(theMatch.team_2, (currentPointsLoser ?? 0) + settings.loss);
			logger.debug(`Awarded ${theMatch.team_2} ${settings.loss} points for ${results.get(theMatch.team_2)} points total`);
			return;
		}

		if (theMatch.team_2_score > theMatch.team_1_score) {
			logger.debug(`Team ${theMatch.team_2} wins match ${index + 1}/${matchesQuery.length}`);
			const currentPointsWinner = results.get(theMatch.team_2);
			results.set(theMatch.team_2, (currentPointsWinner ?? 0) + settings.win);
			logger.debug(`Awarded ${theMatch.team_2} ${settings.win} points for ${results.get(theMatch.team_2)} points total`);
			const currentPointsLoser = results.get(theMatch.team_1);
			results.set(theMatch.team_1, (currentPointsLoser ?? 0) + settings.loss);
			logger.debug(`Awarded ${theMatch.team_1} ${settings.loss} points for ${results.get(theMatch.team_1)} points total`);
			return;
		}

		// And draw
		if (theMatch.team_1_score === theMatch.team_2_score) {
			logger.debug(`Draw. Awarding ${settings.draw} to each team.`);
			const currentPoints1 = results.get(theMatch.team_1);
			const currentPoints2 = results.get(theMatch.team_2);
			results.set(theMatch.team_1, (currentPoints1 ?? 0) + settings.draw);
			results.set(theMatch.team_2, (currentPoints2 ?? 0) + settings.draw);
		}
	});
	logger.debug("Done calculating points.");
	return results;
}