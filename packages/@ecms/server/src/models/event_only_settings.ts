// @generated
// Automatically generated. Don't change this file manually.

import { data_unitsId } from './data_units';
import { recordsId } from './records';
import trackable_data from './trackable_data';

export type event_only_settingsId = string & { " __flavor"?: 'event_only_settings' };

/**
 * Stores settings specific to events.
Records in event_and_groups that refer to this MUST have type "event" - see event_and_groups for how enforeced
 */
export default interface event_only_settings {
  /** Primary key. Index: pk_events_and_groups_clone_clone */
  event_settings_id: event_only_settingsId;

  /** The data this event is tracking, crucial in determining its type. Constrained by an ENUM to just "matches" | "individual" | "none". Mutually exclusive options.

"matches": allow matches to be tracked. REQUIRES enable_teams to be true in event_settings_id
"individual": Individual performance of competitor information is tracked.
"none": no data is tracked. */
  data_tracked: trackable_data;

  /**
   * Can only be used if data_tracked is "individual"
   * Index: fkidx_165
   */
  unit_id: data_unitsId | null;

  /**
   * Optional link to a record store. (if null not linked to one)
   * Index: fkidx_249
   */
  record_store: recordsId | null;
}

/**
 * Stores settings specific to events.
Records in event_and_groups that refer to this MUST have type "event" - see event_and_groups for how enforeced
 */
export interface event_only_settingsInitializer {
  /**
   * Default value: gen_random_uuid()
   * Primary key. Index: pk_events_and_groups_clone_clone
   */
  event_settings_id?: event_only_settingsId;

  /** The data this event is tracking, crucial in determining its type. Constrained by an ENUM to just "matches" | "individual" | "none". Mutually exclusive options.

"matches": allow matches to be tracked. REQUIRES enable_teams to be true in event_settings_id
"individual": Individual performance of competitor information is tracked.
"none": no data is tracked. */
  data_tracked: trackable_data;

  /**
   * Can only be used if data_tracked is "individual"
   * Index: fkidx_165
   */
  unit_id?: data_unitsId | null;

  /**
   * Optional link to a record store. (if null not linked to one)
   * Index: fkidx_249
   */
  record_store?: recordsId | null;
}
