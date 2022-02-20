import { ReqCompetitors, ResCompetitors } from "@ecms/api/events";
import { OrderingOptions, PointsMatches, PointsThresholds } from "@ecms/api/points";
import { competitor_data, events_and_groupsId, points_settingsId } from "@ecms/models";
import connectToDB, { connectToDBKnex } from "../utils/db";
import { fetchCompetitors } from "../utils/fetchCompetitors";
import { getTeamsMapForEventGroup } from "../utils/getTeamsMapForEventGroup";
import createLogger from "../utils/logger";

const logger = createLogger("points:thresholds");

// Little util to see if passes threshold
function passesThreshold(points: number, threshold: number, setting: OrderingOptions): boolean {
	if (setting === OrderingOptions.LOWER) {
		if (points <= threshold) {
			return true;
		} else {
			return false;
		}
	} else {
		if (points >= threshold) {
			return true;
		} else {
			return false;
		}
	}
}


/**
 * Thresholds scoring system
 * Handles own storage!
 * @returns `Map<string, number` of team UUIDs to points
 */
export default async function scoreThresholds(event_id: events_and_groupsId, knex: ReturnType<typeof connectToDBKnex>, settings: PointsThresholds, points_settings_id: points_settingsId): Promise<void> {
	const results = new Map<string, number>();

	logger.info(`Calculating threshold scoring for ${event_id}`);

	// 1: Get teams
	logger.debug("Getting teams...");
	const teams = Array.from((await getTeamsMapForEventGroup(event_id, knex)).values());

	// 1: Begin by fetching competitors for all teams
	const teamToCompetitors = new Map<string, ResCompetitors>();
	for (const team of teams) {
		logger.debug("Retrieving competitors for team " + team);
		teamToCompetitors.set(team, await fetchCompetitors(event_id, team, undefined, true));
	}
	

	// From https://knexjs.org/#Builder-transacting
	await knex.transaction(async function(trx) {
		// 2: We then test the thresholds for each team to find the total!
		for (const [team_id, competitors] of teamToCompetitors.entries()) {
			// Interate through competitors
			let runningTotalHere = 0;
			for (const competitor of competitors) {
				logger.debug("Checking competitor " + competitor.id);
				if (!competitor.stored_data && competitor.stored_data !== "0") {
					logger.debug(`No data found for ${competitor.id}. Skipping....`);
					continue;
				}
				// For each thereshold,
				// We want to find maximum points
				// For each threshold, if lower is better and we have a lower value, assign it as max points
				let maxPoints = 0;
				let grade = "None";
				for (const threshold of settings.thresholds) {
					logger.debug(`Testing against threshold of ${threshold.result}`);
					if (passesThreshold(parseFloat(competitor.stored_data), threshold.points, settings.setting)) {
						// Passed!
						if (maxPoints < threshold.points) { // If we have a new max, assign it
							maxPoints = parseFloat(threshold.points as unknown as string);
							grade = threshold.grade;
						}
						
					}
				}
				logger.debug(`Landed on ${maxPoints} points for ${competitor.id}, grade ${grade}`);
				// Add to total
				runningTotalHere += maxPoints;
				logger.debug("Storing...");
				// Store
				await knex("competitor_data")
					.transacting(trx)
					.update<competitor_data>({
						additional_data: {
							grade: grade
						},
						points: maxPoints.toString(10),
					})
					.where("competitor_id", competitor.competitor_id)
					.andWhere("competitor_settings_id", competitor.competitor_settings_id)
					.catch(function (e) {
						logger.error("ERROR!");
						logger.error(JSON.stringify(e));
						//trx.rollback();
						throw e;
					});
			}

			// Store total
			logger.debug(`Storing running total for ${team_id}, total; ${runningTotalHere}...`);
			await knex("store_overall_points")
				.transacting(trx)
				.insert({
					points_settings_id: points_settings_id,
					team_id: team_id,
					points: runningTotalHere,
					sum_points: runningTotalHere
				})
				.onConflict(["points_settings_id", "team_id"])
				.merge()
				.catch(function (e) {
					logger.error("ERROR!");
					logger.error(JSON.stringify(e));
					//trx.rollback();
					throw e;
				});
		}

		logger.debug("Done!");
		//trx.commit();
	});

	return;
}