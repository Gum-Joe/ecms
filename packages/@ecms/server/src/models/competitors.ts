// @generated
// Automatically generated. Don't change this file manually.

import { teamsId } from './teams';

export type competitorsId = number & { " __flavor"?: 'competitors' };

/**
 * All the competitors stored in our system. Join to the event/groups they are part of in the join_competitor_events_group table - this is because ideally for multiple events rather than copy the competitor for each one you'd just refer to the same record.
 */
export default interface competitors {
  /** Primary key. Index: pk_competitors */
  competitor_id: competitorsId;

  /**
   * Public ID of competitor, used so we don't expose raw IDs
   * Index: fkidx_900_competitor_id
   */
  id: string;

  lastname: string;

  firstname: string;

  /** Index: fkidx_90 */
  team_id: teamsId | null;

  data: unknown;
}

/**
 * All the competitors stored in our system. Join to the event/groups they are part of in the join_competitor_events_group table - this is because ideally for multiple events rather than copy the competitor for each one you'd just refer to the same record.
 */
export interface competitorsInitializer {
  /**
   * Default value: nextval('competitors_competitor_id_seq'::regclass)
   * Primary key. Index: pk_competitors
   */
  competitor_id?: competitorsId;

  /**
   * Public ID of competitor, used so we don't expose raw IDs
   * Index: fkidx_900_competitor_id
   */
  id: string;

  lastname: string;

  firstname: string;

  /** Index: fkidx_90 */
  team_id?: teamsId | null;

  data: unknown;
}
