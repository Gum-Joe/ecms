-- *************** SqlDBM: PostgreSQL ****************;
-- ***************************************************;


-- ************************************** "public".record_group

CREATE TABLE "public".record_group
(
 record_group_id uuid NOT NULL DEFAULT gen_random_uuid(),
 name            text NOT NULL,
 CONSTRAINT PK_record_group PRIMARY KEY ( record_group_id )
);

COMMENT ON TABLE "public".record_group IS 'Stored the groups records can be put into.';





