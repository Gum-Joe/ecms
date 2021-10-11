-- *************** SqlDBM: PostgreSQL ****************;
-- ***************************************************;


-- ************************************** "public"."matches"

-- Checks if a referred event is of the type event
-- Data type not checked.
CREATE FUNCTION matches_event_type_check() RETURNS trigger AS $$
BEGIN
	PERFORM * FROM "public".events_and_groups WHERE event_group_id = NEW.parent_event AND type = 'event';
		IF NOT FOUND THEN
			RAISE NOTICE 'Foreign key violation - tried to refer to a row in events_and_groups that was not an event!';
			RETURN NULL;
		END IF;
		RETURN NEW; -- Important to ensure the row being inserted is not modified
END;
$$ LANGUAGE plpgsql;

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

COMMENT ON CONSTRAINT FK_team_event ON "public"."matches" IS 'Constrain to type: event';
COMMENT ON COLUMN "public"."matches".parent_event IS 'Parent EVENT this match is for. CONSTAIN to type: event';
CREATE TRIGGER matches_check_is_event
BEFORE INSERT OR UPDATE ON "public"."matches"
FOR EACH ROW EXECUTE PROCEDURE matches_event_type_check();

COMMENT ON COLUMN "public"."matches".locked IS 'Require an extra tap to edit (to prevent accidental edits)';






