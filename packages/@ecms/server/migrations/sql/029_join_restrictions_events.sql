-- *************** SqlDBM: PostgreSQL ****************;
-- ***************************************************;


-- ************************************** "public".join_restrictions_events

-- Checks a referrred event_id is an event (as it references a record in the event_and_groups table!)
CREATE FUNCTION check_if_event_id_is_event() RETURNS trigger AS $$
BEGIN
	PERFORM * FROM "public".events_and_groups WHERE event_group_id = NEW.event_id AND type = 'event';
		IF NOT FOUND THEN
			RAISE EXCEPTION  'Foreign key violation - tried to refer to a row in events_and_groups that was not an event!';
			RETURN NULL;
		END IF;
		RETURN NEW; -- Important to ensure the row being inserted is not modified
END;
$$ LANGUAGE plpgsql;

CREATE TABLE "public".join_restrictions_events
(
 restriction_id bigint NOT NULL,
 event_id       uuid NOT NULL,
 CONSTRAINT FK_restrictions_join_events FOREIGN KEY ( restriction_id ) REFERENCES "public".restrictions ( restriction_id ),
 CONSTRAINT FK_join_event_to_join_table_restrictions FOREIGN KEY ( event_id ) REFERENCES "public".events_and_groups ( event_group_id )
);

CREATE INDEX fkIdx_197 ON "public".join_restrictions_events
(
 event_id
);

COMMENT ON TABLE "public".join_restrictions_events IS 'Join restrictions to events the restrictions is enforced on.
CONSTRAIN that event_id must have parent_id matching parent_group_id of the restrictions table.';

COMMENT ON COLUMN "public".join_restrictions_events.event_id IS 'CONSTRAIN to type: event';
CREATE TRIGGER join_restrictions_check_if_event
BEFORE INSERT OR UPDATE ON "public".join_restrictions_events
FOR EACH ROW EXECUTE PROCEDURE check_if_event_id_is_event();




