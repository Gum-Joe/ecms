// @generated
// Automatically generated. Don't change this file manually.

import { usersId } from './users';
import { user_groupsId } from './user_groups';

/**
 * Tells us which users are in which groups
 */
export default interface join_users_groups {
  /** Index: fkidx_213 */
  user_id: usersId;

  /** Index: fkidx_216 */
  user_group_id: user_groupsId;
}

/**
 * Tells us which users are in which groups
 */
export interface join_users_groupsInitializer {
  /** Index: fkidx_213 */
  user_id: usersId;

  /** Index: fkidx_216 */
  user_group_id: user_groupsId;
}
