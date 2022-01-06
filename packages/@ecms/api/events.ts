/**
 * Routes for events
 * @packageDocumentation
 */
import { competitors, competitor_data, data_units, event_only_settings, matches, teamsId } from "@ecms/models";

export type ReqEditMatchScores = Pick<matches, "match_id" | "team_1_score" | "team_2_score">[];
export type ResEventInfo = event_only_settings & {
	unit?: data_units | null;
}

/**
 * Used to request competitors from the DB
 */
export interface ReqCompetitors {
	team_id?: teamsId;
}
export type ResCompetitors = Array<competitors & competitor_data>;