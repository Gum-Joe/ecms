-- *************** SqlDBM: PostgreSQL ****************;
-- ***************************************************;


-- ************************************** "public".roles

CREATE TABLE "public".roles
(
 role_id       uuid NOT NULL DEFAULT gen_random_uuid(),
 name          text NOT NULL,
 "path"          ltree NOT NULL,
 description   text NOT NULL,
 has_parameter boolean NOT NULL,
 CONSTRAINT PK_roles PRIMARY KEY ( role_id )
);

COMMENT ON TABLE "public".roles IS 'Stores the roles that users can be assigned and their paths in the role tree. Requires the ltree extension.';

COMMENT ON COLUMN "public".roles."path" IS 'Role path in the role hierarchy.
Enable the ltree extensions.
USE "." to separate roles.
http://patshaughnessy.net/2017/12/13/saving-a-tree-in-postgres-using-ltree';
COMMENT ON COLUMN "public".roles.has_parameter IS 'Does this role require a parameter?
Parameter can only be an event/group ID.';




