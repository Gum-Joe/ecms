-- *************** SqlDBM: PostgreSQL ****************;
-- ***************************************************;


-- ************************************** "public".users

CREATE TABLE "public".users
(
 user_id   uuid NOT NULL DEFAULT gen_random_uuid(),
 name      text NOT NULL,
 auth_type char(5) NOT NULL,
 password  text NOT NULL DEFAULT md5(random()::text),
 email     text NOT NULL,
 CONSTRAINT PK_users PRIMARY KEY ( user_id ),
 CONSTRAINT check_email CHECK ( email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$' )
);

COMMENT ON TABLE "public".users IS 'Stores the users of the system, both OAuth and Local authentication.';

COMMENT ON COLUMN "public".users.name IS 'Name of user. NOT username.';
COMMENT ON COLUMN "public".users.auth_type IS 'OAUTH or LOCAL (OAUTH here mean "Sign in with Google").';
COMMENT ON COLUMN "public".users.password IS 'SALT & HASH THESE!!!
Set to random string by default.';
COMMENT ON COLUMN "public".users.email IS 'Email of the user: used as their login for local auth, and checked to see if they are a valid user if OAuth based auth.';




