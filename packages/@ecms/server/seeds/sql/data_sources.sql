-- *************** SqlDBM: PostgreSQL ****************;
-- ***************************************************;


-- ************************************** "public".data_sources

CREATE TABLE "public".data_sources
(
 data_source_id uuid NOT NULL DEFAULT gen_random_uuid(),
 module_id      uuid NOT NULL,
 event_group_id uuid NOT NULL,
 config         jsonb NOT NULL,
 CONSTRAINT PK_data_source_settings PRIMARY KEY ( data_source_id ),
 CONSTRAINT FK_module_to_data_source FOREIGN KEY ( module_id ) REFERENCES "public".installed_modules ( module_id ),
 CONSTRAINT FK_data_source_to_event FOREIGN KEY ( event_group_id ) REFERENCES "public".events_and_groups ( event_group_id )
);

CREATE INDEX fkIdx_310 ON "public".data_sources
(
 module_id
);

CREATE INDEX fkIdx_313 ON "public".data_sources
(
 event_group_id
);

COMMENT ON TABLE "public".data_sources IS 'Contains the data sources that have been added to events or groups, and their configs.';

COMMENT ON COLUMN "public".data_sources.data_source_id IS 'ID of the data source, specific to event/groups';




