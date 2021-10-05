-- Warning: You can generate script only for one table/view at a time in your Free plan 
-- 
-- *************** SqlDBM: PostgreSQL ****************;
-- ***************************************************;


-- ************************************** "public".events_and_groups

-- Checks if a referred row in events_and_groups has type: "group"
-- Assumes:
-- 1. In the row being inserted (i.e. table this is on), the ID of the event/group being referred to is event_group_id
-- 2. You are checking against events_and_groups table
-- From https://stackoverflow.com/questions/32709888/define-foreign-key-in-postgres-to-a-subset-of-a-target-table
CREATE FUNCTION check_if_group() RETURNS trigger AS $$
BEGIN
	IF NEW.parent_id IS NOT NULL THEN -- Handle the fact parent_id can be null - events/group do not necessarily have to have a parent
		PERFORM * FROM events_and_groups WHERE event_group_id = NEW.parent_id AND type = 'group';
		IF NOT FOUND THEN
			RAISE NOTICE 'Foreign key violation - tried to refer to record in events_and_groups that was not a group';
			RETURN NULL;
		END IF;
		RETURN NEW; -- Important to ensure the row being inserted is not modified
	ELSE
		RETURN NEW;
	END IF;
END;
$$ LANGUAGE plpgsql;

-- BEGIN SQL CREATION CODE

CREATE TABLE "public".events_and_groups
(
 event_group_id         uuid NOT NULL DEFAULT gen_random_uuid(),
 name                   text NOT NULL,
 description            text NULL,
 enable_teams           boolean NOT NULL,
 enable_charity         boolean NOT NULL,
 inheritance            boolean NOT NULL,
 type                   char(5) NOT NULL,
 parent_id              uuid NULL,
 event_settings_id      uuid NULL,
 points_settings_id     uuid NULL,
 public_dashboard_id    uuid NULL,
 competitor_settings_id uuid NULL,
 complete               boolean NOT NULL DEFAULT FALSE,
 archived               boolean NOT NULL DEFAULT FALSE,
 CONSTRAINT PK_events_and_groups_clone PRIMARY KEY ( event_group_id ),
 CONSTRAINT FK_points_to_event FOREIGN KEY ( points_settings_id ) REFERENCES "public".points_settings ( points_settings_id ),
 CONSTRAINT FK_dashboard_to_event FOREIGN KEY ( public_dashboard_id ) REFERENCES "public".public_dashboards ( public_dashboard_id ),
 CONSTRAINT FK_event_to_comp_settings FOREIGN KEY ( competitor_settings_id ) REFERENCES "public".competitor_settings ( competitor_settings_id ),
 CONSTRAINT FK_parent_group FOREIGN KEY ( parent_id ) REFERENCES "public".events_and_groups ( event_group_id ),
 CONSTRAINT FK_event_settings FOREIGN KEY ( event_settings_id ) REFERENCES "public".event_only_settings ( event_settings_id ),
 CONSTRAINT type_checks CHECK ( type = 'event' OR type = 'group' ),
 
 -- Check event_settings_id is set ONLY if type is "event"
 CONSTRAINT event_setting_check CHECK ( ( event_settings_id IS NULL ) OR ((event_settings_id IS NOT NULL) AND type = 'event') )
);

CREATE INDEX fkIdx_41 ON "public".events_and_groups
(
 parent_id
);

-- Create the check for a parent (parent_id field, i.e. the parent event group) being of type: group
COMMENT ON TABLE "public".events_and_groups IS 'Add a constaint here that referred ID MUST have type "group"';
COMMENT ON COLUMN "public".events_and_groups.parent_id IS 'Constrain to just those with type "group".
ID of the parent group.';
CREATE TRIGGER check_parent_group_is_group
BEFORE INSERT OR UPDATE ON "public".events_and_groups
FOR EACH ROW EXECUTE PROCEDURE check_if_group();


COMMENT ON COLUMN "public".events_and_groups.enable_teams IS 'Auto-inherit if parent_id present - do this manually in code';
COMMENT ON COLUMN "public".events_and_groups.enable_charity IS 'Enable data sources?';
COMMENT ON COLUMN "public".events_and_groups.inheritance IS 'If true, use teams from parent_id and allow competitors to be brought in from parent_id - do this in code';

COMMENT ON COLUMN "public".events_and_groups.points_settings_id IS 'NULL here means no points system has been set. Store the points system settings in the points_settings table.';
COMMENT ON COLUMN "public".events_and_groups.public_dashboard_id IS 'ID of the settings in the public_dashboards table for this event/group. If NULL, there is no public dashboard.';
COMMENT ON COLUMN "public".events_and_groups.competitor_settings_id IS 'If this is not null, provide the option to set this up if type = "event" and data_tracked in the event_only_settings table is "individual"';

COMMENT ON CONSTRAINT FK_event_to_comp_settings ON "public".events_and_groups IS 'ID of the competitor settings, used to then retrieve settings about competitor and the competitors themselves. If NULL, then no competitor are set.';

COMMENT ON CONSTRAINT FK_event_settings ON "public".events_and_groups IS 'Used to refer to the event settings that are stored separately.

Constrain to only allow this if type is "event"';