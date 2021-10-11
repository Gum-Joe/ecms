-- *************** SqlDBM: PostgreSQL ****************;
-- ***************************************************;


-- ************************************** "public".event_only_settings

-- Checks if a "data_tracked" in the event_only_settings is "individual" for when a unit_id is set
-- This is because a unit can ONLY be set on events where data_tracked in "individual" (see general explanation of event types)
CREATE FUNCTION check_data_tracked_is_individual_if_unit() RETURNS trigger AS $$
BEGIN
	IF (NEW.unit_id IS NOT NULL) AND (NEW.data_tracked != 'individual') THEN -- Handle the fact parent_id can be null - events/group do not necessarily have to have a parent
		RAISE NOTICE 'Foreign key violation - tried to set a unit (unit_id) on an event where data_tracked is not "individual"';
		RETURN NULL;
	ELSIF (NEW.data_tracked = 'individual') AND (NEW.unit_id IS NULL) THEN
		RAISE NOTICE 'Foreign key violation - tried to set the event type as "individual" but failed to specify a unit in "unit_id"';
	ELSE
		RETURN NEW;
	END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE "public".event_only_settings
(
 event_settings_id uuid NOT NULL DEFAULT gen_random_uuid(),
 data_tracked      trackable_data NOT NULL, -- see 000_baseline_setup.sql
 unit_id           bigint NULL,
 record_store      uuid NULL,
 CONSTRAINT PK_events_and_groups_clone_clone PRIMARY KEY ( event_settings_id ),
 CONSTRAINT FK_unit_to_event FOREIGN KEY ( unit_id ) REFERENCES "public".data_units ( unit_id ),
 CONSTRAINT FK_event_to_record FOREIGN KEY ( record_store ) REFERENCES "public".records ( record_id ),
 CONSTRAINT data_tracked CHECK ( data_tracked = 'matches' OR data_tracked = 'individual' OR data_tracked = 'none' )
);

CREATE INDEX fkIdx_165 ON "public".event_only_settings
(
 unit_id
);

CREATE INDEX fkIdx_249 ON "public".event_only_settings
(
 record_store
);

-- Create Triggers
COMMENT ON COLUMN "public".event_only_settings.unit_id IS 'Can only be used if data_tracked is "individual"';
CREATE TRIGGER data_tracked_is_individual_if_unit
BEFORE INSERT OR UPDATE ON "public".event_only_settings
FOR EACH ROW EXECUTE PROCEDURE check_data_tracked_is_individual_if_unit();

COMMENT ON TABLE "public".event_only_settings IS 'Stores settings specific to events.
Records in event_and_groups that refer to this MUST have type "event" - see event_and_groups for how enforeced';


COMMENT ON COLUMN "public".event_only_settings.record_store IS 'Optional link to a record store. (if null not linked to one)';
COMMENT ON COLUMN "public".event_only_settings.data_tracked IS 'The data this event is tracking, crucial in determining its type. Constrained by an ENUM to just "matches" | "individual" | "none". Mutually exclusive options.

"matches": allow matches to be tracked. REQUIRES enable_teams to be true in event_settings_id
"individual": Individual performance of competitor information is tracked.
"none": no data is tracked.';




