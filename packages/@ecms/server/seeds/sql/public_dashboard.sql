-- *************** SqlDBM: PostgreSQL ****************;
-- ***************************************************;


-- ************************************** "public".public_dashboards

CREATE TABLE "public".public_dashboards
(
 public_dashboard_id uuid NOT NULL DEFAULT gen_random_uuid(),
 preset_id           uuid NOT NULL,
 config              jsonb NOT NULL,
 CONSTRAINT PK_public_dashboard PRIMARY KEY ( public_dashboard_id ),
 CONSTRAINT FK_dashboard_preset_to_dashboard FOREIGN KEY ( preset_id ) REFERENCES "public".public_dashboard_presets ( preset_id )
);

COMMENT ON TABLE "public".public_dashboards IS 'Settings for the public dashboards, specific to an event/group';





