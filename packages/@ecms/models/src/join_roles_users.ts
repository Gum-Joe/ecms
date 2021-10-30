// @generated
// Automatically generated. Don't change this file manually.

import { usersId } from './users';
import { rolesId } from './roles';
import { events_and_groupsId } from './events_and_groups';

/**
 * Join users to the roles assigned to them
 */
export default interface join_roles_users {
  /** Index: fkidx_227 */
  user_id: usersId;

  /** Index: fkidx_230 */
  role_id: rolesId;

  /**
   * Parameter for this event.
CONSTRAIN to only allow it to be set if has_param in the roles table is true. Must be an event/group ID
   * Index: fkidx_235
   */
  param: events_and_groupsId | null;
}

/**
 * Join users to the roles assigned to them
 */
export interface join_roles_usersInitializer {
  /** Index: fkidx_227 */
  user_id: usersId;

  /** Index: fkidx_230 */
  role_id: rolesId;

  /**
   * Parameter for this event.
CONSTRAIN to only allow it to be set if has_param in the roles table is true. Must be an event/group ID
   * Index: fkidx_235
   */
  param?: events_and_groupsId | null;
}
