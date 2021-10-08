-- This script sets us the Postgres DB with the features we need to create our database
-- It does NOT create the DB for us

CREATE EXTENSION IF NOT EXISTS "ltree";

-- NOTE: COMMENT ON ____ is used as the tool we use to convert the DB
-- to TypeScript interfaces can use the COMMENT ON metadata to add
-- JSDoc comments to the generates interfaces.

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

-- Module types
-- This ENUM governs the types of extensions there can be
-- Currently there are only two:
-- 1. dataSource - these are extensions that provide sources of data for charity events,
-- to collect things like how much money has been raised from a source of data like JustGiving
-- or Eventbrite
-- 2. pointsSystem - extensions that contain the logic to calculate points teams or competitors have acheived
-- These are included in the ecms.type field of the package.json (extensions are written as node.js modules)
CREATE TYPE extension_types AS ENUM (
	'dataSource',
	'pointsSystem'
);
COMMENT ON TYPE extension_types IS 'Module types - this ENUM governs the types of extensions there can be.

Currently there are only two:
1. dataSource - these are extensions that provide sources of data for charity events,
to collect things like how much money has been raised from a source of data like JustGiving
or Eventbrite

2. pointsSystem - extensions that contain the logic to calculate points teams or competitors have acheived
These are included in the ecms.type field of the package.json (extensions are written as node.js modules)';

-- Install sources for extensions:
-- - npm (installed from npm registry)
-- - git (installed from git repo, using `npm install git+gitrepoURL`)
-- - local (installed from a local folder, usually using `npm link path/to/folder`)
CREATE TYPE extension_install_sources AS ENUM (
	'npm',
	'git',
	'local'
);
COMMENT ON TYPE extension_install_sources IS 'Install sources for extensions:
- npm (installed from npm registry)
- git (installed from git repo, using `npm install git+gitrepoURL`)
- local (installed from a local folder, usually using `npm link path/to/folder`)';
-- TODO: User creation.