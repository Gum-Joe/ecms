-- *************** SqlDBM: PostgreSQL ****************;
-- ***************************************************;


-- ************************************** "public".competitor_removals

CREATE TABLE "public".competitor_removals
(
 competitor_settings_id uuid NOT NULL,
 competitor_id          int NOT NULL,
 CONSTRAINT FK_comp_settings_to_removals FOREIGN KEY ( competitor_settings_id ) REFERENCES "public".competitor_settings ( competitor_settings_id ),
 CONSTRAINT FK_competitors_to_removals FOREIGN KEY ( competitor_id ) REFERENCES "public".competitors ( competitor_id )
);

CREATE INDEX fkIdx_111_clone ON "public".competitor_removals
(
 competitor_settings_id
);

CREATE INDEX fkIdx_114_clone ON "public".competitor_removals
(
 competitor_id
);

COMMENT ON TABLE "public".competitor_removals IS 'Contains specific removals to competitors from e.g. inheritance. These are those specifically removed from an event/group.';





