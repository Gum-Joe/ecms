-- *************** SqlDBM: PostgreSQL ****************;
-- ***************************************************;


-- ************************************** "public".competitor_settings

CREATE TABLE "public".competitor_settings
(
 competitor_settings_id uuid NOT NULL DEFAULT gen_random_uuid(),
 type                   text NOT NULL,
 CONSTRAINT PK_competitor_matching PRIMARY KEY ( competitor_settings_id ),
 CONSTRAINT check_type_competitors CHECK ( type == "discrete" OR type == "inherit" OR type =="filter_parent" )
);

COMMENT ON TABLE "public".competitor_settings IS 'Controls how events are matched to their competitors';

COMMENT ON COLUMN "public".competitor_settings.type IS 'What type of match this is:
- discrete - competitors directly set/imported - query the competitors join table with the event_group_id from event_group_id
- inherit - all the competitors from the parent_id of event_group_id  contains
- filter_parent: competitors filtered from the parent (parent_id). Either query the join table, or run the filters directly (latter recommended)

Done to avoid a massive join table with duplicate join entries for every single event (i.e. repeat 100 join records for every event that uses the same set of competitors)';




