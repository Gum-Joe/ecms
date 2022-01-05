/**
 * Routes for events
 * @packageDocumentation
 */
import { data_units, event_only_settings, matches } from "@ecms/models";

export type ReqEditMatchScores = Pick<matches, "match_id" | "team_1_score" | "team_2_score">[];
export type ResEventInfo = event_only_settings & {
	unit?: data_units | null;
}