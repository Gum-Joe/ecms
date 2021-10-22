-- *************** SqlDBM: PostgreSQL ****************;
-- ***************************************************;


-- ************************************** "public".join_roles_user_groups & join_roles_users - included in same file due to similarties 

-- Checks a param is set ONLY if the role requires it
CREATE FUNCTION check_param_set_only() RETURNS trigger AS $$
BEGIN
	IF NEW.param IS NOT NULL THEN
		PERFORM * FROM "public".roles WHERE role_id = NEW.role_id AND has_parameter = TRUE;
		IF NOT FOUND THEN
			RAISE NOTICE 'Foreign key violation - tried to provide a parameter for a role without one!';
			RETURN NULL;
		END IF;
		RETURN NEW; -- Important to ensure the row being inserted is not modified
	END IF;
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE "public".join_roles_user_groups
(
 role_id       uuid NOT NULL, -- must match role_id field of join_roles_users
 param         uuid NULL, -- must match join_roles_users param field
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
CREATE TRIGGER join_roles_groups_params
BEFORE INSERT OR UPDATE ON "public".join_roles_user_groups
FOR EACH ROW EXECUTE PROCEDURE check_param_set_only();

-- ************************************** "public".join_roles_users

CREATE TABLE "public".join_roles_users
(
 user_id uuid NOT NULL,
 role_id uuid NOT NULL, -- must match role_id field of join_roles_user_groups
 param   uuid NULL, -- must match join_roles_user_groups param field
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
CREATE TRIGGER join_roles_users_params
BEFORE INSERT OR UPDATE ON "public".join_roles_users
FOR EACH ROW EXECUTE PROCEDURE check_param_set_only();




