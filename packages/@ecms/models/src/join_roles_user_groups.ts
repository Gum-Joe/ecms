// @generated
// Automatically generated. Don't change this file manually.

import { rolesId } from './roles';
import { events_and_groupsId } from './events_and_groups';
import { user_groupsId } from './user_groups';

/**
 * Join user_groups to the roles assigned to them
 */
export default interface join_roles_user_groups {
  /** Index: fkidx_230_clone */
  role_id: rolesId;

  /**
   * Parameter for this event.
CONSTRAIN to only allow it to be set if has_param is true. If not set, assume can access all events
   * Index: fkidx_235_clone
   */
  param: events_and_groupsId | null;

  /** Index: fkidx_245 */
  user_group_id: user_groupsId;
}

/**
 * Join user_groups to the roles assigned to them
 */
export interface join_roles_user_groupsInitializer {
  /** Index: fkidx_230_clone */
  role_id: rolesId;

  /**
   * Parameter for this event.
CONSTRAIN to only allow it to be set if has_param is true. If not set, assume can access all events
   * Index: fkidx_235_clone
   */
  param?: events_and_groupsId | null;

  /** Index: fkidx_245 */
  user_group_id: user_groupsId;
}
