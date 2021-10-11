-- *************** SqlDBM: PostgreSQL ****************;
-- ***************************************************;


-- ************************************** "public".store_overall_points

CREATE TABLE "public".store_overall_points
(
 points_settings_id uuid NOT NULL,
 overall_points_id  uuid NOT NULL DEFAULT gen_random_uuid(),
 team_id            uuid NOT NULL,
 points             decimal NOT NULL,
 sum_points         decimal NOT NULL,
 overriden          boolean NOT NULL DEFAULT FALSE,
 CONSTRAINT PK_store_overall_points PRIMARY KEY ( overall_points_id ),
 CONSTRAINT FK_point_to_store FOREIGN KEY ( points_settings_id ) REFERENCES "public".points_settings ( points_settings_id ),
 CONSTRAINT FK_teams_to_points_store FOREIGN KEY ( team_id ) REFERENCES "public".teams ( team_id )
);

CREATE INDEX fkIdx_262 ON "public".store_overall_points
(
 points_settings_id
);

CREATE INDEX fkIdx_265 ON "public".store_overall_points
(
 team_id
);

COMMENT ON TABLE "public".store_overall_points IS 'Overall, i.e. per team, points';

COMMENT ON COLUMN "public".store_overall_points.sum_points IS 'Running total of points so far - automatically calculated regardless of points system.

Field should be the same as "points" if not a group.';
COMMENT ON COLUMN "public".store_overall_points.overriden IS 'Set to true if this has been overridden manually.
If true, do not overwrite the points or sum_points stored here.';




