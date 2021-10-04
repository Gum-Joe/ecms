-- *************** SqlDBM: PostgreSQL ****************;
-- ***************************************************;


-- ************************************** "public".join_roles_users

CREATE TABLE "public".join_roles_users
(
 user_id uuid NOT NULL,
 role_id uuid NOT NULL,
 param   uuid NULL,
 CONSTRAINT FK_userws_to_user_role_join_table FOREIGN KEY ( user_id ) REFERENCES "public".users ( user_id ),
 CONSTRAINT FK_roles_to_users_join_table FOREIGN KEY ( role_id ) REFERENCES "public".roles ( role_id ),
 CONSTRAINT FK_event_group_to_param_users FOREIGN KEY ( param ) REFERENCES "public".events_and_groups ( event_group_id )
);

CREATE INDEX fkIdx_227 ON "public".join_roles_users
(
 user_id
);

CREATE INDEX fkIdx_230 ON "public".join_roles_users
(
 role_id
);

CREATE INDEX fkIdx_235 ON "public".join_roles_users
(
 param
);

COMMENT ON TABLE "public".join_roles_users IS 'Join users to the roles assigned to them';

COMMENT ON COLUMN "public".join_roles_users.param IS 'Parameter for this event.
CONSTRAIN to only allow it to be set if has_param in the roles table is true. Must be an event/group ID';




