-- *************** SqlDBM: PostgreSQL ****************;
-- ***************************************************;


-- ************************************** "public".restrictions

-- Checks if a restriction's parent group is a group
-- Since restrictions are set at a group level to be enforced on events in that group
CREATE FUNCTION restrictions_check_if_group() RETURNS trigger AS $$
BEGIN
	IF NEW.parent_id IS NOT NULL THEN -- Handle the fact parent_id can be null - events/group do not necessarily have to have a parent
		PERFORM * FROM events_and_groups WHERE event_group_id = NEW.parent_group_id AND type = 'group';
		IF NOT FOUND THEN
			RAISE EXCEPTION  'Foreign key violation - tried to refer to record in events_and_groups that was not a group!';
			RETURN NULL;
		END IF;
		RETURN NEW; -- Important to ensure the row being inserted is not modified
	ELSE
		RETURN NEW;
	END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE "public".restrictions
(
 restriction_id  bigserial NOT NULL,
 max_events      int NOT NULL,
 parent_group_id uuid NOT NULL,
 CONSTRAINT PK_restrictions PRIMARY KEY ( restriction_id ),
 CONSTRAINT FK_restrictions_to_group FOREIGN KEY ( parent_group_id ) REFERENCES "public".events_and_groups ( event_group_id )
);

CREATE INDEX fkIdx_190 ON "public".restrictions
(
 parent_group_id
);

COMMENT ON TABLE "public".restrictions IS 'Restrictions on how many events competitors can be entered into.
Multiple restrictions per event allowed.';

COMMENT ON COLUMN "public".restrictions.max_events IS 'Maximum events, based on those from the join table, a competitor can take part in.';
COMMENT ON COLUMN "public".restrictions.parent_group_id IS 'The group the restrictions was added to. Can be enforced in sub-events.';

COMMENT ON CONSTRAINT FK_restrictions_to_group ON "public".restrictions IS 'Parent group. Constrain to type "group"';
CREATE TRIGGER restrictions_group_type_check
BEFORE INSERT OR UPDATE ON "public".restrictions
FOR EACH ROW EXECUTE PROCEDURE restrictions_check_if_group();




