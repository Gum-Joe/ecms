-- *************** SqlDBM: PostgreSQL ****************;
-- ***************************************************;


-- ************************************** "public".join_users_groups

CREATE TABLE "public".join_users_groups
(
 user_id       uuid NOT NULL,
 user_group_id uuid NOT NULL,
 CONSTRAINT FK_user_join_group FOREIGN KEY ( user_id ) REFERENCES "public".users ( user_id ),
 CONSTRAINT FK_user_group_to_join_users_table FOREIGN KEY ( user_group_id ) REFERENCES "public".user_groups ( user_group_id )
);

CREATE INDEX fkIdx_213 ON "public".join_users_groups
(
 user_id
);

CREATE INDEX fkIdx_216 ON "public".join_users_groups
(
 user_group_id
);

COMMENT ON TABLE "public".join_users_groups IS 'Tells us which users are in which groups';





