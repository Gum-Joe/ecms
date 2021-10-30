// @generated
// Automatically generated. Don't change this file manually.

import { data_unitsId } from './data_units';
import { record_groupId } from './record_group';

export type recordsId = string & { " __flavor"?: 'records' };

/**
 * Stores the records (from individual competitor events) themselves
 */
export default interface records {
  /** Primary key. Index: pk_records */
  record_id: recordsId;

  record_name: string;

  current_holder_firstname: string;

  current_holder_lastname: string;

  /** Index: fkidx_183 */
  unit_id: data_unitsId;

  current_record: string;

  /** Index: fkidx_180 */
  record_group_id: record_groupId;
}

/**
 * Stores the records (from individual competitor events) themselves
 */
export interface recordsInitializer {
  /**
   * Default value: gen_random_uuid()
   * Primary key. Index: pk_records
   */
  record_id?: recordsId;

  record_name: string;

  current_holder_firstname: string;

  current_holder_lastname: string;

  /** Index: fkidx_183 */
  unit_id: data_unitsId;

  current_record: string;

  /** Index: fkidx_180 */
  record_group_id: record_groupId;
}
