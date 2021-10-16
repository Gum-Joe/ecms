// @generated
// Automatically generated. Don't change this file manually.

export type record_groupId = string & { " __flavor"?: 'record_group' };

/**
 * Stored the groups records can be put into.
 */
export default interface record_group {
  /** Primary key. Index: pk_record_group */
  record_group_id: record_groupId;

  name: string;
}

/**
 * Stored the groups records can be put into.
 */
export interface record_groupInitializer {
  /**
   * Default value: gen_random_uuid()
   * Primary key. Index: pk_record_group
   */
  record_group_id?: record_groupId;

  name: string;
}
