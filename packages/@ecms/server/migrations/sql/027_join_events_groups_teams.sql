-- *************** SqlDBM: PostgreSQL ****************;
-- ***************************************************;


-- ************************************** "public".join_events_groups_teams

CREATE TABLE "public".join_events_groups_teams
(
 event_group_id uuid NOT NULL,
 team_id        uuid NOT NULL,
 CONSTRAINT FK_event_group_to_teams FOREIGN KEY ( event_group_id ) REFERENCES "public".events_and_groups ( event_group_id ),
 CONSTRAINT FK_team_to_join_events_groups FOREIGN KEY ( team_id ) REFERENCES "public".teams ( team_id )
);

CREATE INDEX fkIdx_60 ON "public".join_events_groups_teams
(
 team_id
);

COMMENT ON TABLE "public".join_events_groups_teams IS 'Joins the teams to the events/group they are in (remember, if an event/group inherits teams it links back to this by walking back up the tree of events/groups until one with teams sets for them is found)';





