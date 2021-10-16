// @generated
// Automatically generated. Don't change this file manually.

import { restrictionsId } from './restrictions';
import { events_and_groupsId } from './events_and_groups';

/**
 * Join restrictions to events the restrictions is enforced on.
CONSTRAIN that event_id must have parent_id matching parent_group_id of the restrictions table.
 */
export default interface join_restrictions_events {
  restriction_id: restrictionsId;

  /**
   * CONSTRAIN to type: event
   * Index: fkidx_197
   */
  event_id: events_and_groupsId;
}

/**
 * Join restrictions to events the restrictions is enforced on.
CONSTRAIN that event_id must have parent_id matching parent_group_id of the restrictions table.
 */
export interface join_restrictions_eventsInitializer {
  restriction_id: restrictionsId;

  /**
   * CONSTRAIN to type: event
   * Index: fkidx_197
   */
  event_id: events_and_groupsId;
}
