/** 
 * Contains constants for ECMS
 * @packageDocumentation
 */

/** Name of the users table */
export const USERS_TABLE = "users";

/**
 * Beginning of key to store setups in redis. Put the setup ID after it.
 * @example ```ts
 * await redis.HSET(SETUP_REDIS_KEY_PREFIX + setupID);
 * ```
 */
export const SETUP_REDIS_KEY_PREFIX = "transactions:create_event_group:";

/**
 * Beginning of key to store IMPORTED COMPETITORS in redis. Put the setup ID after it.
 * @example ```ts
 * await redis.HSET(SETUP_REDIS_KEY_PREFIX + setupID);
 * ```
 */
export const COMPETITOR_IMPORT_REDIS_KEY_PREFIX = "transactions:imported_competitors:";