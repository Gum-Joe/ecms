-- *************** SqlDBM: PostgreSQL ****************;
-- ***************************************************;


-- ************************************** "public".records

CREATE TABLE "public".records
(
 record_id                uuid NOT NULL DEFAULT gen_random_uuid(),
 record_name              text NOT NULL,
 current_holder_firstname text NOT NULL,
 current_holder_lastname  text NOT NULL,
 unit_id                  bigint NOT NULL,
 current_record           decimal NOT NULL,
 record_group_id          uuid NOT NULL,
 CONSTRAINT PK_records PRIMARY KEY ( record_id ),
 CONSTRAINT FK_record_to_record_group FOREIGN KEY ( record_group_id ) REFERENCES "public".record_group ( record_group_id ),
 CONSTRAINT FK_record_unit_id FOREIGN KEY ( unit_id ) REFERENCES "public".data_units ( unit_id )
);

CREATE INDEX fkIdx_180 ON "public".records
(
 record_group_id
);

CREATE INDEX fkIdx_183 ON "public".records
(
 unit_id
);

COMMENT ON TABLE "public".records IS 'Stores the records (from individual competitor events) themselves';





