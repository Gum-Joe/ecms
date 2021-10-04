-- *************** SqlDBM: PostgreSQL ****************;
-- ***************************************************;


-- ************************************** "public".join_restrictions_events

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

COMMENT ON CONSTRAINT FK_join_event_to_join_table_restrictions ON "public".join_restrictions_events IS 'constrain to type: "event"';




