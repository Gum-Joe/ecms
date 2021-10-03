-- *************** SqlDBM: PostgreSQL ****************;
-- ***************************************************;


-- ************************************** "public".competitor_additions

CREATE TABLE "public".competitor_additions
(
 competitor_settings_id uuid NOT NULL,
 competitor_id          int NOT NULL,
 CONSTRAINT FK_comp_settings_to_additions FOREIGN KEY ( competitor_settings_id ) REFERENCES "public".competitor_settings ( competitor_settings_id ),
 CONSTRAINT FK_competitors_to_additions FOREIGN KEY ( competitor_id ) REFERENCES "public".competitors ( competitor_id )
);

CREATE INDEX fkIdx_111 ON "public".competitor_additions
(
 competitor_settings_id
);

CREATE INDEX fkIdx_114 ON "public".competitor_additions
(
 competitor_id
);

COMMENT ON TABLE "public".competitor_additions IS 'Contains specific additions to competitors that are not present in parent groups (i.e. added at that level rather than in the parent as you should)';





