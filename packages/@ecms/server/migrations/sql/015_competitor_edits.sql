-- *************** SqlDBM: PostgreSQL ****************;
-- ***************************************************;


-- ************************************** "public".competitor_edits

CREATE TABLE "public".competitor_edits
(
 competitor_settings_id uuid NOT NULL,
 edited_competitor      int NOT NULL,
 original_competitor    int NOT NULL,
 CONSTRAINT FK_comp_settings_to_edits FOREIGN KEY ( competitor_settings_id ) REFERENCES "public".competitor_settings ( competitor_settings_id ),
 CONSTRAINT FK_competitors_to_edits FOREIGN KEY ( edited_competitor ) REFERENCES "public".competitors ( competitor_id ),
 CONSTRAINT FK_competitors_to_edits_original FOREIGN KEY ( original_competitor ) REFERENCES "public".competitors ( competitor_id )
);

CREATE INDEX fkIdx_111_clone_clone ON "public".competitor_edits
(
 competitor_settings_id
);

CREATE INDEX fkIdx_114_clone_clone ON "public".competitor_edits
(
 edited_competitor
);

CREATE INDEX fkIdx_127 ON "public".competitor_edits
(
 original_competitor
);

COMMENT ON TABLE "public".competitor_edits IS 'Records edits made to competitor information in events/group which have inherited or filtered from parent. Done by relating the original record to a new record that contains the edits - in the future, later edits to the original can be copied to edited_competitor.

When querying, remove and replace original_competitor with edited_competitor';

COMMENT ON COLUMN "public".competitor_edits.edited_competitor IS 'Points to the UUID of the record that stores the data about the edited competitor';
COMMENT ON COLUMN "public".competitor_edits.original_competitor IS 'Original competitor that was edited';




