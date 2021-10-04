-- *************** SqlDBM: PostgreSQL ****************;
-- ***************************************************;


-- ************************************** "public".join_competitor_events_group

CREATE TABLE "public".join_competitor_events_group
(
 competitor_id          int NOT NULL,
 competitor_settings_id uuid NOT NULL,
 CONSTRAINT FK_join_competitor_to_events_groups FOREIGN KEY ( competitor_id ) REFERENCES "public".competitors ( competitor_id ),
 CONSTRAINT FK_join_comp_settings_to_group FOREIGN KEY ( competitor_settings_id ) REFERENCES "public".competitor_settings ( competitor_settings_id )
);

CREATE INDEX fkIdx_149 ON "public".join_competitor_events_group
(
 competitor_id
);

CREATE INDEX fkIdx_347 ON "public".join_competitor_events_group
(
 competitor_settings_id
);

COMMENT ON TABLE "public".join_competitor_events_group IS 'For linking events to competitors. TO prevent this having many, many entires, use this only for:
1. discretely set or imported competitors
2. a cache of the filtered competitors (generated when filters run)

Use the specific additionas and removals table for additions and removals.';


COMMENT ON CONSTRAINT FK_join_comp_settings_to_group ON "public".join_competitor_events_group IS 'Used to join to the event/group';




