-- This script sets us the Postgres DB with the features we need to create our database
-- It does NOT create the DB for us

CREATE EXTENSION IF NOT EXISTS "ltree";

-- ENUM to refer to a event_and_group type
-- these can either be an "event" or "group"
-- The ENUM allos us to restrict values to just event or group when inserting or querying fields that should either have "event" or "group" as a value
CREATE TYPE event_or_group AS ENUM ('event', 'group');
COMMENT ON TYPE event_or_group IS 'ENUM to refer to a event_and_group type. These can either be an "event" or "group". The ENUM allos us to restrict values to just event or group when inserting or querying fields that should either have "event" or "group" as a value';

-- The data an event can track, crucial in determining event type. Can be one of (mutually exclusive options):
-- "matches": allow matches to be tracked. REQUIRES enable_teams to be true in event_settings_id
-- "individual": Individual performance of competitor information is tracked.
-- "none": no data is tracked.
CREATE TYPE trackable_data AS ENUM (
	'matches',
	'individual',
	'none'
);
COMMENT ON TYPE trackable_data IS 'The data an event can track, crucial in determining its type. CONSTRAIN to just "matches" | "individual" | "none". Mutually exclusive options.

"matches": allow matches to be tracked. REQUIRES enable_teams to be true in event_settings_id
"individual": Individual performance of competitor information is tracked.
"none": no data is tracked.';

-- TODO: User creation.