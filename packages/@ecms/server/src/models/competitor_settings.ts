// @generated
// Automatically generated. Don't change this file manually.

import competitor_setting_types from './competitor_setting_types';

export type competitor_settingsId = string & { " __flavor"?: 'competitor_settings' };

/**
 * Controls how events are matched to their competitors
 */
export default interface competitor_settings {
  /** Primary key. Index: pk_competitor_matching */
  competitor_settings_id: competitor_settingsId;

  /** What type of match this is:
- discrete - competitors directly set/imported - query the competitors join table with the event_group_id from event_group_id
- inherit - all the competitors from the parent_id of event_group_id  contains
- filter_parent: competitors filtered from the parent (parent_id). Either query the join table, or run the filters directly (latter recommended)

Done to avoid a massive join table with duplicate join entries for every single event (i.e. repeat 100 join records for every event that uses the same set of competitors) */
  type: competitor_setting_types;
}

/**
 * Controls how events are matched to their competitors
 */
export interface competitor_settingsInitializer {
  /**
   * Default value: gen_random_uuid()
   * Primary key. Index: pk_competitor_matching
   */
  competitor_settings_id?: competitor_settingsId;

  /** What type of match this is:
- discrete - competitors directly set/imported - query the competitors join table with the event_group_id from event_group_id
- inherit - all the competitors from the parent_id of event_group_id  contains
- filter_parent: competitors filtered from the parent (parent_id). Either query the join table, or run the filters directly (latter recommended)

Done to avoid a massive join table with duplicate join entries for every single event (i.e. repeat 100 join records for every event that uses the same set of competitors) */
  type: competitor_setting_types;
}
