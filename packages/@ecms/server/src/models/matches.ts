// @generated
// Automatically generated. Don't change this file manually.

import { events_and_groupsId } from './events_and_groups';
import { teamsId } from './teams';

export type matchesId = string & { " __flavor"?: 'matches' };

/**
 * Stores matches for events, the teams playing them and their scores.
CONSTRAIN parent_event to those with type event.
 */
export default interface matches {
  /** Primary key. Index: pk_matches */
  match_id: matchesId;

  /**
   * Parent EVENT this match is for. CONSTAIN to type: event
   * Index: fkidx_70
   */
  parent_event: events_and_groupsId;

  team_1: teamsId;

  team_1_score: number;

  team_2: teamsId;

  team_2_score: number;

  /** Require an extra tap to edit (to prevent accidental edits) */
  locked: boolean;
}

/**
 * Stores matches for events, the teams playing them and their scores.
CONSTRAIN parent_event to those with type event.
 */
export interface matchesInitializer {
  /**
   * Default value: gen_random_uuid()
   * Primary key. Index: pk_matches
   */
  match_id?: matchesId;

  /**
   * Parent EVENT this match is for. CONSTAIN to type: event
   * Index: fkidx_70
   */
  parent_event: events_and_groupsId;

  team_1: teamsId;

  team_1_score: number;

  team_2: teamsId;

  team_2_score: number;

  /** Require an extra tap to edit (to prevent accidental edits) */
  locked: boolean;
}
