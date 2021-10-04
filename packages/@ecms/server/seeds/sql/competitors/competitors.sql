-- *************** SqlDBM: PostgreSQL ****************;
-- ***************************************************;


-- ************************************** "public".competitors

CREATE TABLE "public".competitors
(
 competitor_id int NOT NULL DEFAULT gen_random_uuid(),
 "id"            uuid NOT NULL,
 lastname      text NOT NULL,
 firstname     text NOT NULL,
 team_id       uuid NULL,
 data          jsonb NOT NULL,
 CONSTRAINT PK_competitors PRIMARY KEY ( competitor_id ),
 CONSTRAINT FK_teams_to_competitor FOREIGN KEY ( team_id ) REFERENCES "public".teams ( team_id )
);

CREATE INDEX fkIdx_90 ON "public".competitors
(
 team_id
);

COMMENT ON TABLE "public".competitors IS 'All the competitors stored in our system. Join to the event/groups they are part of in the join_competitor_events_group table - this is because ideally for multiple events rather than copy the competitor for each one you''d just refer to the same record.';

COMMENT ON COLUMN "public".competitors."id" IS 'Public ID of competitor, used so we don''t expose raw IDs';




