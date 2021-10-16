// @generated
// Automatically generated. Don't change this file manually.

import { installed_modulesId } from './installed_modules';
import { events_and_groupsId } from './events_and_groups';

export type data_sourcesId = string & { " __flavor"?: 'data_sources' };

/**
 * Contains the data sources that have been added to events or groups, and their configs.
 */
export default interface data_sources {
  /**
   * ID of the data source, specific to event/groups
   * Primary key. Index: pk_data_source_settings
   */
  data_source_id: data_sourcesId;

  /** Index: fkidx_310 */
  module_id: installed_modulesId;

  /** Index: fkidx_313 */
  event_group_id: events_and_groupsId;

  config: unknown;
}

/**
 * Contains the data sources that have been added to events or groups, and their configs.
 */
export interface data_sourcesInitializer {
  /**
   * ID of the data source, specific to event/groups
   * Default value: gen_random_uuid()
   * Primary key. Index: pk_data_source_settings
   */
  data_source_id?: data_sourcesId;

  /** Index: fkidx_310 */
  module_id: installed_modulesId;

  /** Index: fkidx_313 */
  event_group_id: events_and_groupsId;

  config: unknown;
}
