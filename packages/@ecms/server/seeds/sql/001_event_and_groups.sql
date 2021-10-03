-- Warning: You can generate script only for one table/view at a time in your Free plan 
-- 
-- *************** SqlDBM: PostgreSQL ****************;
-- ***************************************************;


-- ************************************** "public".events_and_groups

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
 CONSTRAINT type_checks CHECK ( type == "event" OR type == "group" ),
 CONSTRAINT data_tracked CHECK ( data_tracked == "matches" OR data_tracked == "individual" OR data_tracked == "none" )
);

CREATE INDEX fkIdx_41 ON "public".events_and_groups
(
 parent_id
);

COMMENT ON TABLE "public".events_and_groups IS 'Add a constaint here that referred ID MUST have type "group"';

COMMENT ON COLUMN "public".events_and_groups.enable_teams IS 'Auto-inherit if parent_id present';
COMMENT ON COLUMN "public".events_and_groups.enable_charity IS 'Enable data sources?';
COMMENT ON COLUMN "public".events_and_groups.inheritance IS 'If true, use teams from parent_id and allow competitors to be brought in from parent_id';
COMMENT ON COLUMN "public".events_and_groups.parent_id IS 'Constrain to just those with type "group".
ID of the parent group.';
COMMENT ON COLUMN "public".events_and_groups.points_settings_id IS 'NULL here means no points system has been set. Store the points system settings in the points_settings table.';
COMMENT ON COLUMN "public".events_and_groups.public_dashboard_id IS 'ID of the settings in the public_dashboards table for this event/group. If NULL, there is no public dashboard.';
COMMENT ON COLUMN "public".events_and_groups.competitor_settings_id IS 'If this is not null, provide the option to set this up if type == "event" and data_tracked in the event_only_settings table is "individual"';

COMMENT ON CONSTRAINT FK_event_to_comp_settings ON "public".events_and_groups IS 'ID of the competitor settings, used to then retrieve settings about competitor and the competitors themselves. If NULL, then no competitor are set.';

COMMENT ON CONSTRAINT FK_event_settings ON "public".events_and_groups IS 'Used to refer to the event settings that are stored separately.

Constrain to only allow this if type is "event"';