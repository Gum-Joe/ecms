-- *************** SqlDBM: PostgreSQL ****************;
-- ***************************************************;


-- ************************************** "public".data_source_keys

CREATE TABLE "public".data_source_keys
(
 key_id         uuid NOT NULL DEFAULT gen_random_uuid(),
 key_name       text NOT NULL,
 key_value      text NOT NULL,
 module_id      uuid NOT NULL,
 data_source_id uuid NULL,
 CONSTRAINT PK_data_soruces_keys PRIMARY KEY ( key_id ),
 CONSTRAINT FK_module_to_keys FOREIGN KEY ( module_id ) REFERENCES "public".installed_modules ( module_id ),
 CONSTRAINT FK_data_sources_to_keys FOREIGN KEY ( data_source_id ) REFERENCES "public".data_sources ( data_source_id )
);

CREATE INDEX fkIdx_301 ON "public".data_source_keys
(
 module_id
);

CREATE INDEX fkIdx_353 ON "public".data_source_keys
(
 data_source_id
);

COMMENT ON TABLE "public".data_source_keys IS 'Used by data source modules to store their keys, either per event/group (hence the link to a data_source via data_source_id) or globally (for the keys parts of the admin panel - do this by setting data_source_id to NULL).

NB: Use Postgres POLICIES Feature (https://www.postgresql.org/docs/9.5/ddl-rowsecurity.html) to only allow access to rows that match a data source''s module name.
Use users/roles for this.

Can optionally relate to an event.

OAuth keys should be stored with key_name "oauth_key"';

COMMENT ON COLUMN "public".data_source_keys.module_id IS 'CONSTRAIN: must be same as data_sources module_id';
COMMENT ON COLUMN "public".data_source_keys.data_source_id IS 'ID of data source these keys are stored for. Leave NULL for a global key,';




