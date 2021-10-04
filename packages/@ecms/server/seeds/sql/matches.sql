-- *************** SqlDBM: PostgreSQL ****************;
-- ***************************************************;


-- ************************************** "public"."matches"

CREATE TABLE "public"."matches"
(
 match_id     uuid NOT NULL DEFAULT gen_random_uuid(),
 parent_event uuid NOT NULL,
 team_1       uuid NOT NULL,
 team_1_score smallint NOT NULL,
 team_2       uuid NOT NULL,
 team_2_score smallint NOT NULL,
 locked       boolean NOT NULL,
 CONSTRAINT PK_matches PRIMARY KEY ( match_id ),
 CONSTRAINT FK_team_event FOREIGN KEY ( parent_event ) REFERENCES "public".events_and_groups ( event_group_id ),
 CONSTRAINT FK_team_1 FOREIGN KEY ( team_1 ) REFERENCES "public".teams ( team_id ),
 CONSTRAINT FK_team_2 FOREIGN KEY ( team_2 ) REFERENCES "public".teams ( team_id )
);

CREATE INDEX fkIdx_70 ON "public"."matches"
(
 parent_event
);

COMMENT ON TABLE "public"."matches" IS 'Stores matches for events, the teams playing them and their scores.
CONSTRAIN parent_event to those with type event.';

COMMENT ON COLUMN "public"."matches".parent_event IS 'Parent EVENT this match is for. CONSTAIN to type: event';
COMMENT ON COLUMN "public"."matches".locked IS 'Require an extra tap to edit (to prevent accidental edits)';

COMMENT ON CONSTRAINT FK_team_event ON "public"."matches" IS 'Constrain to type: event';




