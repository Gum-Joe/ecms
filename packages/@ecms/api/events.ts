/**
 * Routes for events
 * @packageDocumentation
 */
import { matches } from "@ecms/models";

export type ReqEditMatchScores = Pick<matches, "match_id" | "team_1_score" | "team_2_score">[];