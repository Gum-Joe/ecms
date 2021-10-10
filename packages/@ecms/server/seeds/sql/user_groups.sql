-- *************** SqlDBM: PostgreSQL ****************;
-- ***************************************************;


-- ************************************** "public".user_groups

CREATE TABLE "public".user_groups
(
 user_group_id uuid NOT NULL DEFAULT gen_random_uuid(),
 name          text NOT NULL,
 CONSTRAINT PK_user_groups PRIMARY KEY ( user_group_id )
);

COMMENT ON TABLE "public".user_groups IS 'Stores the groups users can be in. Users can be in multiple groups, hence join tables are used (see join_users_groups))';





