// @generated
// Automatically generated. Don't change this file manually.

export type rolesId = string & { " __flavor"?: 'roles' };

/**
 * Stores the roles that users can be assigned and their paths in the role tree. Requires the ltree extension.
 */
export default interface roles {
  /** Primary key. Index: pk_roles */
  role_id: rolesId;

  name: string;

  /** Role path in the role hierarchy.
Enable the ltree extensions.
USE "." to separate roles.
http://patshaughnessy.net/2017/12/13/saving-a-tree-in-postgres-using-ltree */
  path: string;

  description: string;

  /** Does this role require a parameter$1
Parameter can only be an event/group ID. */
  has_parameter: boolean;
}

/**
 * Stores the roles that users can be assigned and their paths in the role tree. Requires the ltree extension.
 */
export interface rolesInitializer {
  /**
   * Default value: gen_random_uuid()
   * Primary key. Index: pk_roles
   */
  role_id?: rolesId;

  name: string;

  /** Role path in the role hierarchy.
Enable the ltree extensions.
USE "." to separate roles.
http://patshaughnessy.net/2017/12/13/saving-a-tree-in-postgres-using-ltree */
  path: string;

  description: string;

  /** Does this role require a parameter$1
Parameter can only be an event/group ID. */
  has_parameter: boolean;
}
