/**
 * Common API routes for events and group
 * @packageDocumentation
 */
import { FieldDescriptor, ResCompetitorFields, ResCompetitorFilter, ResEventsGroupsList } from "@ecms/api/common";
import { ReqCompetitors } from "@ecms/api/events";
import { competitorsId, competitor_filters, competitor_settings, competitor_settingsId, competitor_setting_types, events_and_groups, events_and_groupsId, teams } from "@ecms/models";
import { Router } from "express";
import filterCompetitorFrom from "../setup/filter";
import { connectToDBKnex } from "../utils/db";
import { ECMSResponse, RequestWithBody } from "../utils/interfaces";
import createLogger from "../utils/logger";
import { getTeamsMapForEventGroup } from "../utils/getTeamsMapForEventGroup";
import followInheritance from "../utils/followInheritance";

const router = Router();
const logger = createLogger("api:setup");


// Use Knex - easier to query with!
const knex = connectToDBKnex();

/**
 * Returns a list of events/groups, by default those not in a group
 * Accept a parameter fromId to get events/groups that have a `parent_id` of the provided value
 */
router.get("/list", async (req, res: ECMSResponse<ResEventsGroupsList>) => {
	try {
		let idParam = null;
		if (req.query.fromId && req.query.fromId !== "null" && req.query.fromId !== "undefined") {
			idParam = req.query.fromId as string;
		}
		logger.info("Getting list of events and group...");
		const theList = await knex
			.select("name")
			.select("event_group_id")
			.select("description")
			.select("type")
			.select("parent_id")
			.select("complete")
			.select("archived")
			.from("events_and_groups")
			.where("parent_id", idParam);
		res.json(theList);
	} catch (err) {
		logger.error("Error getting list of events!");
		logger.error((err as Error)?.message);
		res.status(500).json({
			message: `Internal Server Error - ${(err as Error)?.message}`,
		});
	}
});

/**
 * Retrieve teams associated with an event/group
 * TODO: Follow inheritance
 */
router.get("/:id/teams", async (req, res: ECMSResponse<teams[]>, next) => {
	const queryeventID = req.params.id;
	logger.info(`Retrieving teams for ${queryeventID} using inheritance...`);
	
	try {
		const { event_group_id: eventID } = await followInheritance(queryeventID, knex);
		const teams = await knex
			.select<teams[]>("*")
			.from("join_events_groups_teams")
			.where("event_group_id", eventID)
			.join("teams", "join_events_groups_teams.team_id", "teams.team_id");

		res.json(teams);
	} catch (err) {
		logger.error(`Error getting teams for event ${queryeventID}!`);
		logger.error((err as Error)?.message);
		res.status(500).json({
			message: `Internal Server Error - ${(err as Error)?.message}`,
		});
	}
	
});


/**
 * Retrieve general info about an event/group
 */
router.get("/:id/info", async (req, res: ECMSResponse<events_and_groups>, next) => {
	const eventID = req.params.id;
	logger.info(`Retrieving information for event/group ${eventID}...`);
	try {
		const info = await knex
			.select<events_and_groups[]>("*")
			.from("events_and_groups")
			.where("event_group_id", eventID);

		res.json(info[0]);
	} catch (err) {
		logger.error(`Error getting info for event ${eventID}!`);
		logger.error((err as Error)?.message);
		res.status(500).json({
			message: `Internal Server Error - ${(err as Error)?.message}`,
		});
	}
	
});

interface CombineEventsAndGroups extends competitor_settings {
	parent_id: events_and_groups["parent_id"];
	event_group_id: events_and_groups["event_group_id"];
}

/**
 * Retrieves competitor from a group/event.
 * 
 * How it works:
 * 1. If the competitor type is discrete, query it directly
 * 2. If copy, run this algorithm again on the parent
 * 3. If filter_parent, run the filter alogirthm!
 * 
 * @param event_group_id ID of event/group to fetch from
 * @param inheritedChildID Optional ID of a child event/group to use for the data columns of the fetched competitors. Please specify the `competitor_settings_id` of the child event in question.
 */
async function fetchCompetitors(event_group_id: string, team_id: string, inheritedChildID?: competitor_settingsId): Promise<ReqCompetitors[]> {
	logger.info(`Getting competitors from ${event_group_id}`);
	// Check settings
	const eventSettings = await knex
		.select("events_and_groups.competitor_settings_id")
		.select("events_and_groups.parent_id")
		.select<CombineEventsAndGroups>("competitor_settings.*")
		.from("events_and_groups")
		.where("events_and_groups.event_group_id", event_group_id)
		.join("competitor_settings", "events_and_groups.competitor_settings_id", "competitor_settings.competitor_settings_id")
		.first();
	if (!eventSettings) {
		throw new Error("No competitor settings found for this event! Please check competitors have been set.");
	}

	// Now check type
	if (eventSettings.type === "discrete") {
		logger.info("Querying directly as of type discrete...");
		// Retrieve 
		const dbres = await knex
			.select("competitors.id")
			.select("competitors.lastname")
			.select("competitors.firstname")
			.select("competitors.data")
			.select("competitors.team_id")
			.select("competitor_data.competitor_data_id")
			.select("competitor_data.stored_data")
			.select("competitor_data.points")
			.select("competitor_data.additional_data")
			.select("competitor_data.overriden")
			.select("competitor_data.dnf")
			.from("competitors")
		// TODO: Order messed up!
			.where("competitors.team_id", team_id)
		// Get any prestored data using the competitor_settings_id
		// anything beyond the above for competitor_settings_id may result in data for a different event being returned!
			.leftJoin("competitor_data", function () {
				this.on("competitors.competitor_id", "=", "competitor_data.competitor_id")
					.andOnVal("competitor_data.competitor_settings_id", inheritedChildID ?? eventSettings.competitor_settings_id);
			})
			.orderBy("competitors.firstname", "asc")
			.orderBy("competitors.lastname", "asc");
		logger.info("Done.");
		return dbres;
		
	} else if (eventSettings.type === "inherit") {
		logger.debug("Inherited competitors detected. Calling recursivly...");
		if (!eventSettings.parent_id) {
			logger.error("No parent_id found!");
			throw new Error("Asked to inherit competitors but no parent_id found!");
		}
		return fetchCompetitors(eventSettings.parent_id, team_id, inheritedChildID);
	} else if (eventSettings.type === "filter_parent") {
		// Filters
		logger.debug("Getting filtered IDs of competitors...");
		const filteredIDs = await filterCompetitorFrom(event_group_id, null, knex, await getTeamsMapForEventGroup(event_group_id, knex));
		// Transform
		const IDsList = filteredIDs.map(x => x.competitor_id);
		// Now query based on it!
		logger.debug(`Querying records for ${IDsList.length} competitors...`);
		const dbres = await knex
			.select("competitors.id")
			.select("competitors.lastname")
			.select("competitors.firstname")
			.select("competitors.data")
			.select("competitors.team_id")
			.select("competitor_data.competitor_data_id")
			.select("competitor_data.stored_data")
			.select("competitor_data.points")
			.select("competitor_data.additional_data")
			.select("competitor_data.overriden")
			.select("competitor_data.dnf")
			.from("competitors")
		// TODO: Order messed up!
			.where("competitors.team_id", team_id)
			.whereIn("competitors.competitor_id", IDsList)
			// Get any prestored data using the competitor_settings_id
			// anything beyond the above for competitor_settings_id may result in data for a different event being returned!
			.leftJoin("competitor_data", function () {
				this.on("competitors.competitor_id", "=", "competitor_data.competitor_id")
					.andOnVal("competitor_data.competitor_settings_id", inheritedChildID ?? eventSettings.competitor_settings_id);
			})
			.orderBy("competitors.firstname", "asc")
			.orderBy("competitors.lastname", "asc");
		logger.info("Done.");
		return dbres;
	} else {
		logger.error(`Unreognised competitor_settings type: ${eventSettings.type}`);
		throw new Error(`Unrecognised competitor_settings type: ${eventSettings.type}`);
	}

	
        
}

/**
 * Checks if competitors are in use for a specific event
 * @returns Competitor settings if found, null if none found
 */
async function hasCompetitors(event_group_id: string): Promise<competitor_settings | null> {
	const competitorSettingsArr = await knex
		.select("competitor_settings.*")
		.select("events_and_groups.competitor_settings_id")
		.from("events_and_groups")
		.where("events_and_groups.event_group_id", event_group_id)
		.leftJoin("competitor_settings", "events_and_groups.competitor_settings_id", "competitor_settings.competitor_settings_id");
	if (competitorSettingsArr.length === 0) {
		return null;
	} else {
		return competitorSettingsArr[0];
	}
}

/**
 * Retrieve competitors - currently just by team
 * Also gets data for the competitor
 * 
 * Please provide the team_id in the request PARAMETERS!
 */
router.get("/:id/competitors", async (req, res, next) => {
	const eventID = req.params.id;
	const teamID = req.query.team_id as string;
	if (req.query.team_id) {
		logger.info(`Fetching competitor from event/group ${req.params.id} for team ${teamID}...`);
    
		try {
			// TODO: Apply competitor_additions, etc!
			logger.debug("Getting competitor settings ID...");
			const eventSettingsArr = await knex
				.select("competitor_settings_id")
				.select<Pick<events_and_groups, "parent_id" | "competitor_settings_id">[]>("parent_id")
				.from("events_and_groups")
				.where("event_group_id", eventID);
			if (eventSettingsArr.length === 0) {
				return res.status(403).json({
					message: "No competitor settings found for this event! Please check competitors have been set.",
				});
			}

			// Check inheritance
			logger.info("Checking inheritance..");
			const competitorSettingsArr = await knex
				.select<competitor_settings[]>("*")
				.from("competitor_settings")
				.where("competitor_settings_id", eventSettingsArr[0].competitor_settings_id);
			if (competitorSettingsArr.length === 0) {
				res.status(500);
				return res.json({
					message: "No competitor settings found!"
				});
			}
			const competitorSettings = competitorSettingsArr[0];

			const competitors = await fetchCompetitors(eventID, teamID); // Handles inheritance for us!
			res.json(competitors);
			return;

			/*if (competitorSettings.type === "inherit") {
				logger.info("Fetching data from parent as 'inherit' set as competitor_settings type...");
				if (!eventSettingsArr[0].parent_id) {
					res.status(500);
					return res.json({
						message: "Inheritance of competitors set for an event with no parent_id!"
					});
				}

				// Get the competitors
				const competitors = await fetchCompetitors(eventSettingsArr[0].parent_id, teamID, competitorSettings.competitor_settings_id);
				res.json(competitors);
				logger.info("Done.");
				return;

			} else {
				const competitors = await fetchCompetitors(eventID, teamID);
				res.json(competitors);
			}*/
			
		} catch (err) {
			logger.error(`Error getting competitors for event/group ${eventID}!`);
			logger.error((err as Error)?.message);
			res.status(500).json({
				message: `Internal Server Error - ${(err as Error)?.message}`,
			});
		}
	}
});

router.get("/:id/competitors/fields", async (req, res: ECMSResponse<ResCompetitorFields>, next) => {
	const eventID = req.params.id;
	logger.info(`Fetching fields from event/group ${eventID}`);
	try {
		// 1: Check we can do this
		const competitorSettings = await hasCompetitors(eventID);
		if (!competitorSettings) {
			logger.info("No competitor settings found!");
			return res.status(400).json({
				message: "No competitor settings found!"
			});
		}

		// 2: retrieve keys - Postgres does this for us! - https://stackoverflow.com/questions/36141388/how-can-i-get-all-keys-from-a-json-column-in-postgres/57174042
		const keys = await knex.raw(`
			SELECT DISTINCT jsonb_object_keys(data)
			FROM competitors
			INNER JOIN join_competitor_events_group
				ON join_competitor_events_group.competitor_id = competitors.competitor_id
			WHERE join_competitor_events_group.competitor_settings_id = ?
			;`, competitorSettings.competitor_settings_id);
		
		// 3: get values
		logger.debug("Fields fetched. Getting values..." );
		const mapped: FieldDescriptor[] = await Promise.all(keys.rows.map(async (row: { jsonb_object_keys: string }): Promise<FieldDescriptor> => {
			const values = await knex.raw(`
				SELECT DISTINCT data -> ? AS retrieved
				FROM competitors
				INNER JOIN join_competitor_events_group
					ON join_competitor_events_group.competitor_id = competitors.competitor_id
				WHERE join_competitor_events_group.competitor_settings_id = ?
				ORDER BY retrieved ASC
			`, [row.jsonb_object_keys, competitorSettings.competitor_settings_id]);
			return {
				name: row.jsonb_object_keys,
				values: values.rows.map((r: { "retrieved": string }) => r["retrieved"]),
			};
		}));

		// 4: get teams
		logger.debug("Getting default column of team...");
		const teamsListArr = await knex.raw(`
		WITH competitor_team AS (
			SELECT DISTINCT team_id
			FROM competitors
			INNER JOIN join_competitor_events_group
							ON join_competitor_events_group.competitor_id = competitors.competitor_id
						WHERE join_competitor_events_group.competitor_settings_id = ?
		) 
		SELECT array_agg(teams.name) FROM competitor_team
		INNER JOIN teams
			ON teams.team_id = competitor_team.team_id;
		`, competitorSettings.competitor_settings_id);

		const teamsList = teamsListArr.rows?.[0]["array_agg"];

		res.json({
			fields: mapped,
			flattenedList: keys.rows.map((r: { jsonb_object_keys: string }) => r.jsonb_object_keys),
			defaults: [{
				name: "Team",
				values: teamsList ?? []
			}],
		});
	} catch (err) {
		logger.error(`Error getting fields of competitors for event/group ${eventID}!`);
		logger.error((err as Error)?.message);
		res.status(500).json({
			message: `Internal Server Error - ${(err as Error)?.message}`,
		});
	}


});

/**
 * Get list of competitor IDs from filters
 */
router.post("/:id/competitors/filter", async (req: RequestWithBody<{ filters: competitor_filters[] }>, res: ECMSResponse<ResCompetitorFilter>, next) => {
	const eventID: events_and_groupsId = req.params.id;
	if (!Array.isArray(req.body.filters)) {
		return res.status(400).json({
			message: "No filters provided!"
		});
	}
	try {
		const teamsMap = await getTeamsMapForEventGroup((await followInheritance(eventID, knex)).event_group_id, knex);
		const competitorIds = await filterCompetitorFrom(
			eventID,
			req.body.filters,
			knex,
			teamsMap
		);

		return res.json(competitorIds.map((competitor) => competitor.competitor_id));
	
	} catch (err) {
		logger.error(`Error filtering competitors for event/group ${eventID}!`);
		logger.error((err as Error)?.message);
		res.status(500).json({
			message: `Internal Server Error - ${(err as Error)?.message}`,
		});
	}
	
});

export default router;


