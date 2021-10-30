// @generated
// Automatically generated. Don't change this file manually.

import { events_and_groupsId } from './events_and_groups';
import { teamsId } from './teams';

/**
 * Joins the teams to the events/group they are in (remember, if an event/group inherits teams it links back to this by walking back up the tree of events/groups until one with teams sets for them is found)
 */
export default interface join_events_groups_teams {
  event_group_id: events_and_groupsId;

  /** Index: fkidx_60 */
  team_id: teamsId;
}

/**
 * Joins the teams to the events/group they are in (remember, if an event/group inherits teams it links back to this by walking back up the tree of events/groups until one with teams sets for them is found)
 */
export interface join_events_groups_teamsInitializer {
  event_group_id: events_and_groupsId;

  /** Index: fkidx_60 */
  team_id: teamsId;
}
