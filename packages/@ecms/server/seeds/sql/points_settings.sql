-- *************** SqlDBM: PostgreSQL ****************;
-- ***************************************************;


-- ************************************** "public".points_settings

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




