/**
 * Contains the types for the config file
 * 
 * The config file is a .env file, loaded by the server when the program starts.
 * Use these types to extend process.env so you can refer to config values.
 */

declare namespace NodeJS {
	export interface ProcessEnv {
		/** Port ECMS runs on, default 9090 */
		ECMS_PORT: string;
		/** Absolute path to logging folder(default $PWD / logs) */
		ECMS_LOGS_LOCATION: string;
		/** Google OAuth Client ID */
		ECMS_GOOGLE_CLIENT_ID: string;
		/** Google OAuth Client Secret */
		ECMS_GOOGLE_CLIENT_SECRET: string;
		/** Used to sign sessions to ensure their validity */
		ECMS_SESSION_SECRET: string;
		/** true or false.Determines if debug logging should occur(default false */
		ECMS_DEBUG: string;
		/** true or false.Silences all logging(used for testing to silence them). Not reccomended to set this. */
		ECMS_LOG_SILENT: string;
		/** Hostname of PostgreSQL DB */
		ECMS_DB_HOSTNAME: string;
		/** Port of DB */
		ECMS_DB_PORT: string;
		/** PostgreSQL username */
		ECMS_DB_USERNAME: string;
		/** PostgreSQL password */
		ECMS_DB_PASSWORD: string;
		/** PostgresSQL Database to use (e.g. the "postgres" database, or the "ecms" DB) */
		ECMS_DB_DB: string;
		/** URL to Redis instance */
		ECMS_REDIS_URL: string;
		/** Redis username */
		ECMS_REDIS_USERNAME: string;
		/** Redis password */
		ECMS_REDIS_PASSWORD: string;
		/** URL to SMTP server */
		ECMS_SMTP_URL: string;
		/** SMTP server username */
		ECMS_SMTP_USERNAME: string;
		/** SMTP server password */
		ECMS_SMTP_PASSWORD: string;
		/** Absolute path to HTTPS private key */
		ECMS_HTTPS_PRIVATE: string;
		/** Absolute path to HTTPS public key */
		ECMS_HTTPS_PUBLIC: string;
		/** Percentage threshold to mark an event automatically as complete – see 2.5.11.2 */
		ECMS_MARK_AS_COMPLETE_AT: string;

	}
}