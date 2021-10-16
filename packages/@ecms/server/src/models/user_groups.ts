// @generated
// Automatically generated. Don't change this file manually.

export type user_groupsId = string & { " __flavor"?: 'user_groups' };

/**
 * Stores the groups users can be in. Users can be in multiple groups, hence join tables are used (see join_users_groups))
 */
export default interface user_groups {
  /** Primary key. Index: pk_user_groups */
  user_group_id: user_groupsId;

  name: string;
}

/**
 * Stores the groups users can be in. Users can be in multiple groups, hence join tables are used (see join_users_groups))
 */
export interface user_groupsInitializer {
  /**
   * Default value: gen_random_uuid()
   * Primary key. Index: pk_user_groups
   */
  user_group_id?: user_groupsId;

  name: string;
}
