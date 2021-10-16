// @generated
// Automatically generated. Don't change this file manually.

import { installed_modulesId } from './installed_modules';
import { data_sourcesId } from './data_sources';

export type data_source_keysId = string & { " __flavor"?: 'data_source_keys' };

/**
 * Used by data source modules to store their keys, either per event/group (hence the link to a data_source via data_source_id) or globally (for the keys part of the admin panel - do this by setting data_source_id to NULL for such a global key).

NB: Use Postgres POLICIES Feature (https://www.postgresql.org/docs/9.5/ddl-rowsecurity.html) to only allow access to rows that match a data source's module name, asumming each data source get its own DB user to access its information in this table (this may or may not be the case)
Use users/roles for this.

Can optionally relate to an event by setting a data_source_id.

OAuth keys should be stored with key_name "oauth_key"
 */
export default interface data_source_keys {
  /** Primary key. Index: pk_data_soruces_keys */
  key_id: data_source_keysId;

  key_name: string;

  key_value: string;

  /**
   * CONSTRAIN: must be same as data_sources module_id
   * Index: fkidx_301
   */
  module_id: installed_modulesId;

  /**
   * ID of data source these keys are stored for. Leave NULL for a global key,
   * Index: fkidx_353
   */
  data_source_id: data_sourcesId | null;
}

/**
 * Used by data source modules to store their keys, either per event/group (hence the link to a data_source via data_source_id) or globally (for the keys part of the admin panel - do this by setting data_source_id to NULL for such a global key).

NB: Use Postgres POLICIES Feature (https://www.postgresql.org/docs/9.5/ddl-rowsecurity.html) to only allow access to rows that match a data source's module name, asumming each data source get its own DB user to access its information in this table (this may or may not be the case)
Use users/roles for this.

Can optionally relate to an event by setting a data_source_id.

OAuth keys should be stored with key_name "oauth_key"
 */
export interface data_source_keysInitializer {
  /**
   * Default value: gen_random_uuid()
   * Primary key. Index: pk_data_soruces_keys
   */
  key_id?: data_source_keysId;

  key_name: string;

  key_value: string;

  /**
   * CONSTRAIN: must be same as data_sources module_id
   * Index: fkidx_301
   */
  module_id: installed_modulesId;

  /**
   * ID of data source these keys are stored for. Leave NULL for a global key,
   * Index: fkidx_353
   */
  data_source_id?: data_sourcesId | null;
}
