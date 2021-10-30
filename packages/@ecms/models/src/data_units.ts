// @generated
// Automatically generated. Don't change this file manually.

export type data_unitsId = string & { " __flavor"?: 'data_units' };

/**
 * Used for events that require units - stores the units used by these events, and their names.
Set a constraint on the event_only_settings table that if a record there referes to this it must have data_tracked "individual" (see event_only_settings table)

Can be in many event_only_settings or records as duplication may cause this to arise. When a duplication occurs, if the unit is to remain the same we link to the same unit for the duplicated event and any new records (records table) created for it.

Please warn the user when they change the data_unit for an event/record if there are multiple events/records using the unit - create a new unit and link to that if the user select to NOT change the unit in all event and records using it.
 */
export default interface data_units {
  /** Name of the unit, e.g. "Distance" or "Time" */
  unit_name: string;

  /** Primary key. Index: pk_event_units */
  unit_id: data_unitsId;

  /** Unit used. Use "m:s" for the special case of minutes and seconds. */
  unit: string;

  /** Number of decimal place the unit is displayed to */
  decimal_places: number;
}

/**
 * Used for events that require units - stores the units used by these events, and their names.
Set a constraint on the event_only_settings table that if a record there referes to this it must have data_tracked "individual" (see event_only_settings table)

Can be in many event_only_settings or records as duplication may cause this to arise. When a duplication occurs, if the unit is to remain the same we link to the same unit for the duplicated event and any new records (records table) created for it.

Please warn the user when they change the data_unit for an event/record if there are multiple events/records using the unit - create a new unit and link to that if the user select to NOT change the unit in all event and records using it.
 */
export interface data_unitsInitializer {
  /** Name of the unit, e.g. "Distance" or "Time" */
  unit_name: string;

  /**
   * Default value: nextval('data_units_unit_id_seq'::regclass)
   * Primary key. Index: pk_event_units
   */
  unit_id?: data_unitsId;

  /** Unit used. Use "m:s" for the special case of minutes and seconds. */
  unit: string;

  /** Number of decimal place the unit is displayed to */
  decimal_places: number;
}
