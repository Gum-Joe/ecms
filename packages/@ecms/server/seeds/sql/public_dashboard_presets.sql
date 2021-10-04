-- *************** SqlDBM: PostgreSQL ****************;
-- ***************************************************;


-- ************************************** "public".public_dashboard_presets

CREATE TABLE "public".public_dashboard_presets
(
 preset_id uuid NOT NULL DEFAULT gen_random_uuid(),
 name      text NOT NULL,
 CONSTRAINT PK_public_dashboard_presets PRIMARY KEY ( preset_id )
);

COMMENT ON TABLE "public".public_dashboard_presets IS 'Stores the names of public dashboard presets.';





