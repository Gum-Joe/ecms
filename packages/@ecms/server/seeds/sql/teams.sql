-- *************** SqlDBM: PostgreSQL ****************;
-- ***************************************************;


-- ************************************** "public".teams

CREATE TABLE "public".teams
(
 team_id uuid NOT NULL DEFAULT gen_random_uuid(),
 name    text NOT NULL,
 colour  char(7) NOT NULL,
 CONSTRAINT PK_teams PRIMARY KEY ( team_id ),
 CONSTRAINT check_hex CHECK ( colour ~* '^#[A-Fa-f0-9]{2}[A-Fa-f0-9]{2}[A-Fa-f0-9]{2}$' )
);

COMMENT ON TABLE "public".teams IS 'Stores the teams we have for all event/groups.
Allows us to also share the same teams between event/groups without duplicating them.';

COMMENT ON COLUMN "public".teams.colour IS 'Hex of colour to use for team. Include the # in the colour.';




