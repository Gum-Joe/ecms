-- *************** SqlDBM: PostgreSQL ****************;
-- ***************************************************;


-- ************************************** "public".join_roles_user_groups

CREATE TABLE "public".join_roles_user_groups
(
 role_id       uuid NOT NULL,
 param         uuid NULL,
 user_group_id uuid NOT NULL,
 CONSTRAINT FK_roles_to_role_user_group_join FOREIGN KEY ( role_id ) REFERENCES "public".roles ( role_id ),
 CONSTRAINT FK_event_group_to_param_user_groups FOREIGN KEY ( param ) REFERENCES "public".events_and_groups ( event_group_id ),
 CONSTRAINT FK_user_group_to_join_roles FOREIGN KEY ( user_group_id ) REFERENCES "public".user_groups ( user_group_id )
);

CREATE INDEX fkIdx_230_clone ON "public".join_roles_user_groups
(
 role_id
);

CREATE INDEX fkIdx_235_clone ON "public".join_roles_user_groups
(
 param
);

CREATE INDEX fkIdx_245 ON "public".join_roles_user_groups
(
 user_group_id
);

COMMENT ON TABLE "public".join_roles_user_groups IS 'Join user_groups to the roles assigned to them';

COMMENT ON COLUMN "public".join_roles_user_groups.param IS 'Parameter for this event.
CONSTRAIN to only allow it to be set if has_param is true. If not set, assume can access all events';




