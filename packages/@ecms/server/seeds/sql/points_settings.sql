-- *************** SqlDBM: PostgreSQL ****************;
-- ***************************************************;


-- ************************************** "public".points_settings

-- Checks if a instakked_modules has type pointsSystem
CREATE FUNCTION check_module_is_points_system() RETURNS trigger AS $$
BEGIN
	PERFORM * FROM "public".installed_modules WHERE module_id = NEW.module_id AND type = 'pointsSystem'; -- see 000_baseline_setup.sql for types
		IF NOT FOUND THEN
			RAISE NOTICE 'Foreign key violation - tried to refer to a module that was not a pointsSystem!';
			RETURN NULL;
		END IF;
		RETURN NEW; -- Important to ensure the row being inserted is not modified
END;
$$ LANGUAGE plpgsql;

CREATE TABLE "public".points_settings
(
 points_settings_id uuid NOT NULL DEFAULT gen_random_uuid(),
 config             jsonb NOT NULL,
 module_id          uuid NOT NULL,
 CONSTRAINT PK_points PRIMARY KEY ( points_settings_id ),
 CONSTRAINT FK_points_modules FOREIGN KEY ( module_id ) REFERENCES "public".installed_modules ( module_id )
);

COMMENT ON TABLE "public".points_settings IS 'Stores settings for calculating points.
Lack of an entry here means none set.';

COMMENT ON COLUMN "public".points_settings.config IS 'Config for the points system. Is what is provided to ecms.storeConfig() by the module.';
COMMENT ON COLUMN "public".points_settings.module_id IS 'The module that is the points system to use.
CONSTRAIN to type: "pointsSystem" in the installed_modules record';
CREATE TRIGGER points_system_module_check
BEFORE INSERT OR UPDATE ON "public".points_settings
FOR EACH ROW EXECUTE PROCEDURE check_module_is_points_system();




