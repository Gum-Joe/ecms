-- *************** SqlDBM: PostgreSQL ****************;
-- ***************************************************;


-- ************************************** "public".installed_modules

CREATE TABLE "public".installed_modules
(
 module_id       uuid NOT NULL DEFAULT gen_random_uuid(),
 package_name    text NOT NULL,
 type            extension_types NOT NULL, -- see 000_baseline_setup.sql for type
 ecmsObject      jsonb NOT NULL,
 version         text NOT NULL,
 npm_install_arg text NOT NULL,
 installed_from  extension_install_sources NOT NULL, -- see 000_baseline_setup.sql for type 
 CONSTRAINT PK_installed_modules PRIMARY KEY ( module_id )
);

COMMENT ON TABLE "public".installed_modules IS 'Contains an index of the modules installed by the system.';

COMMENT ON COLUMN "public".installed_modules.package_name IS 'NPM Package Name. e.g @ecms/ext-points-thresholds, from its package.json';
COMMENT ON COLUMN "public".installed_modules.type IS 'ENUM: dataSource or pointsSystem (see baseline setup)';
COMMENT ON COLUMN "public".installed_modules.ecmsObject IS 'ECMS Object from package.json';
COMMENT ON COLUMN "public".installed_modules.npm_install_arg IS 'What was entered into npm to install the package.';
COMMENT ON COLUMN "public".installed_modules.installed_from IS 'Where it was installed from.
CONSTRAIN to ENUM: "git", "local" or "npm"';




