-- *************** SqlDBM: PostgreSQL ****************;
-- ***************************************************;


-- ************************************** "public".event_only_settings

CREATE TABLE "public".event_only_settings
(
 event_settings_id uuid NOT NULL DEFAULT gen_random_uuid(),
 data_tracked      text NOT NULL,
 unit_id           bigint NULL,
 record_store      uuid NULL,
 CONSTRAINT PK_events_and_groups_clone_clone PRIMARY KEY ( event_settings_id ),
 CONSTRAINT FK_unit_to_event FOREIGN KEY ( unit_id ) REFERENCES "public".data_units ( unit_id ),
 CONSTRAINT FK_event_to_record FOREIGN KEY ( record_store ) REFERENCES "public".records ( record_id ),
 CONSTRAINT data_tracked CHECK ( data_tracked == "matches" OR data_tracked == "individual" OR data_tracked == "none" )
);

CREATE INDEX fkIdx_165 ON "public".event_only_settings
(
 unit_id
);

CREATE INDEX fkIdx_249 ON "public".event_only_settings
(
 record_store
);

COMMENT ON TABLE "public".event_only_settings IS 'Stores settings specific to events.
Add a constaint here that referred ID MUST have type "event"';

COMMENT ON COLUMN "public".event_only_settings.unit_id IS 'Can only be used if data_tracked is "individual"';
COMMENT ON COLUMN "public".event_only_settings.record_store IS 'Optional link to a record store. (if null not linked to one)';
COMMENT ON COLUMN "public".event_only_settings.data_tracked IS 'The data this even tracked, crucial in determining its type. CONSTRAIN to just "matches" | "individual" | "none". Mutually exclusive options.

"matches": allow matches to be tracked. REQUIRES enable_teams to be true in event_settings_id
"individual": Individual performance of competitor information is tracked.
"none": no data is tracked.';




