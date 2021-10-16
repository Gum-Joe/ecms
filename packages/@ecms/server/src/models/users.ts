// @generated
// Automatically generated. Don't change this file manually.

import login_types from './login_types';

export type usersId = string & { " __flavor"?: 'users' };

/**
 * Stores the users of the system, both OAuth and Local authentication.
 */
export default interface users {
  /** Primary key. Index: pk_users */
  user_id: usersId;

  /** Name of user. NOT username. */
  name: string;

  /** OAUTH or LOCAL (OAUTH here mean "Sign in with Google"). */
  auth_type: login_types;

  /** SALT & HASH THESE!!!
Set to random string by default. */
  password: string;

  /** Email of the user: used as their login for local auth, and checked to see if they are a valid user if OAuth based auth. */
  email: string;
}

/**
 * Stores the users of the system, both OAuth and Local authentication.
 */
export interface usersInitializer {
  /**
   * Default value: gen_random_uuid()
   * Primary key. Index: pk_users
   */
  user_id?: usersId;

  /** Name of user. NOT username. */
  name: string;

  /** OAUTH or LOCAL (OAUTH here mean "Sign in with Google"). */
  auth_type: login_types;

  /**
   * SALT & HASH THESE!!!
Set to random string by default.
   * Default value: md5((random())::text)
   */
  password?: string;

  /** Email of the user: used as their login for local auth, and checked to see if they are a valid user if OAuth based auth. */
  email: string;
}
