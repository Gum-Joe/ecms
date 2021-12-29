-- *************** SqlDBM: PostgreSQL ****************;
-- ***************************************************;


-- ************************************** "public".data_source_keys

-- Checks module_id matches that in data_source_id
CREATE FUNCTION data_source_module_check() RETURNS trigger AS $$
BEGIN
	IF NEW.data_source_id IS NOT NULL THEN -- Handle the fact parent_id can be null - events/group do not necessarily have to have a parent
		PERFORM * FROM data_sources WHERE module_id = NEW.module_id AND data_source_id = data_source_id;
		IF NOT FOUND THEN
			RAISE EXCEPTION  'Foreign key violation - tried to refer to a module_id that is not the same as the one in the referred data_source_id!';
			RETURN NULL;
		END IF;
		RETURN NEW; -- Important to ensure the row being inserted is not modified
	ELSE
		RETURN NEW;
	END IF;
END;
$$ LANGUAGE plpgsql;

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

COMMENT ON TABLE "public".data_source_keys IS 'Used by data source modules to store their keys, either per event/group (hence the link to a data_source via data_source_id) or globally (for the keys part of the admin panel - do this by setting data_source_id to NULL for such a global key).

NB: Use Postgres POLICIES Feature (https://www.postgresql.org/docs/9.5/ddl-rowsecurity.html) to only allow access to rows that match a data source''s module name, asumming each data source get its own DB user to access its information in this table (this may or may not be the case)
Use users/roles for this.

Can optionally relate to an event by setting a data_source_id.

OAuth keys should be stored with key_name "oauth_key"';

COMMENT ON COLUMN "public".data_source_keys.module_id IS 'CONSTRAIN: must be same as data_sources module_id';
CREATE TRIGGER data_source_module_id_check
BEFORE INSERT OR UPDATE ON "public".data_source_keys
FOR EACH ROW EXECUTE PROCEDURE data_source_module_check();

COMMENT ON COLUMN "public".data_source_keys.data_source_id IS 'ID of data source these keys are stored for. Leave NULL for a global key,';




