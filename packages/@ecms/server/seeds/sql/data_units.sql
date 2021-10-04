-- *************** SqlDBM: PostgreSQL ****************;
-- ***************************************************;


-- ************************************** "public".data_units

CREATE TABLE "public".data_units
(
 unit_name      text NOT NULL,
 unit_id        bigint NOT NULL,
 unit           text NOT NULL,
 decimal_places int NOT NULL,
 CONSTRAINT PK_event_units PRIMARY KEY ( unit_id )
);

COMMENT ON TABLE "public".data_units IS 'Used for events that require units - stores the units used by these events, and their names.
Set a constraint that the parent ID must have data_tracked "individual"

Can be in many event_only_settings or records as duplication may cause this to arise. When a duplication occurs, if the unit is to remain the same we link to the same unit for the duplicated event and any new records (records table) created for it.

Please warn the user when they change the data_unit for an event/record if there are multiple events/records using the unit - create a new unit and link to that if the user select to NOT change the unit in all event and records using it.';

COMMENT ON COLUMN "public".data_units.unit_name IS 'Name of the unit, e.g. "Distance" or "Time"';
COMMENT ON COLUMN "public".data_units.unit IS 'Unit used. Use "m:s" for the special case of minutes and seconds.';
COMMENT ON COLUMN "public".data_units.decimal_places IS 'Number of decimal place the unit is displayed to';
COMMENT ON COLUMN "public".data_units.unit_id IS 'AUTOINCREMENT';




