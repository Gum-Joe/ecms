-- *************** SqlDBM: PostgreSQL ****************;
-- ***************************************************;


-- ************************************** "public".restrictions

CREATE TABLE "public".restrictions
(
 restriction_id  bigint NOT NULL,
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

COMMENT ON COLUMN "public".restrictions.restriction_id IS 'AUTOINCREMENT';
COMMENT ON COLUMN "public".restrictions.max_events IS 'Maximum events, based on those from the join table, a competitor can take part in.';
COMMENT ON COLUMN "public".restrictions.parent_group_id IS 'The group the restrictions was added to. Can be enforced in sub-events.';

COMMENT ON CONSTRAINT FK_restrictions_to_group ON "public".restrictions IS 'Parent group. Constrain to type "group"';




