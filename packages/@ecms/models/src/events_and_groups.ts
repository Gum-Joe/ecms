// @generated
// Automatically generated. Don't change this file manually.

import { event_only_settingsId } from './event_only_settings';
import { points_settingsId } from './points_settings';
import { public_dashboardsId } from './public_dashboards';
import { competitor_settingsId } from './competitor_settings';
import event_or_group from './event_or_group';

export type events_and_groupsId = string & { " __flavor"?: 'events_and_groups' };

/**
 * Add a constaint here that referred ID MUST have type "group"
 */
export default interface events_and_groups {
  /** Primary key. Index: pk_events_and_groups_clone */
  event_group_id: events_and_groupsId;

  name: string;

  description: string | null;

  /** Auto-inherit if parent_id present - do this manually in code */
  enable_teams: boolean;

  /** Enable data sources$1 */
  enable_charity: boolean;

  /** If true, use teams from parent_id and allow competitors to be brought in from parent_id - do this in code */
  inheritance: boolean;

  type: event_or_group;

  /**
   * Constrain to just those with type "group".
ID of the parent group.
   * Index: fkidx_41
   */
  parent_id: events_and_groupsId | null;

  event_settings_id: event_only_settingsId | null;

  /** NULL here means no points system has been set. Store the points system settings in the points_settings table. */
  points_settings_id: points_settingsId | null;

  /** ID of the settings in the public_dashboards table for this event/group. If NULL, there is no public dashboard. */
  public_dashboard_id: public_dashboardsId | null;

  /** If this is not null, provide the option to set this up if type = "event" and data_tracked in the event_only_settings table is "individual" */
  competitor_settings_id: competitor_settingsId | null;

  complete: boolean;

  archived: boolean;
}

/**
 * Add a constaint here that referred ID MUST have type "group"
 */
export interface events_and_groupsInitializer {
  /**
   * Default value: gen_random_uuid()
   * Primary key. Index: pk_events_and_groups_clone
   */
  event_group_id?: events_and_groupsId;

  name: string;

  description?: string | null;

  /** Auto-inherit if parent_id present - do this manually in code */
  enable_teams: boolean;

  /** Enable data sources$1 */
  enable_charity: boolean;

  /** If true, use teams from parent_id and allow competitors to be brought in from parent_id - do this in code */
  inheritance: boolean;

  type: event_or_group;

  /**
   * Constrain to just those with type "group".
ID of the parent group.
   * Index: fkidx_41
   */
  parent_id?: events_and_groupsId | null;

  event_settings_id?: event_only_settingsId | null;

  /** NULL here means no points system has been set. Store the points system settings in the points_settings table. */
  points_settings_id?: points_settingsId | null;

  /** ID of the settings in the public_dashboards table for this event/group. If NULL, there is no public dashboard. */
  public_dashboard_id?: public_dashboardsId | null;

  /** If this is not null, provide the option to set this up if type = "event" and data_tracked in the event_only_settings table is "individual" */
  competitor_settings_id?: competitor_settingsId | null;

  /** Default value: false */
  complete?: boolean;

  /** Default value: false */
  archived?: boolean;
}
