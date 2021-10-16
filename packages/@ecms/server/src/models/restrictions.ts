// @generated
// Automatically generated. Don't change this file manually.

import { events_and_groupsId } from './events_and_groups';

export type restrictionsId = string & { " __flavor"?: 'restrictions' };

/**
 * Restrictions on how many events competitors can be entered into.
Multiple restrictions per event allowed.
 */
export default interface restrictions {
  /** Primary key. Index: pk_restrictions */
  restriction_id: restrictionsId;

  /** Maximum events, based on those from the join table, a competitor can take part in. */
  max_events: number;

  /**
   * The group the restrictions was added to. Can be enforced in sub-events.
   * Index: fkidx_190
   */
  parent_group_id: events_and_groupsId;
}

/**
 * Restrictions on how many events competitors can be entered into.
Multiple restrictions per event allowed.
 */
export interface restrictionsInitializer {
  /**
   * Default value: nextval('restrictions_restriction_id_seq'::regclass)
   * Primary key. Index: pk_restrictions
   */
  restriction_id?: restrictionsId;

  /** Maximum events, based on those from the join table, a competitor can take part in. */
  max_events: number;

  /**
   * The group the restrictions was added to. Can be enforced in sub-events.
   * Index: fkidx_190
   */
  parent_group_id: events_and_groupsId;
}
