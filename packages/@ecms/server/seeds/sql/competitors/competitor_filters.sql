-- *************** SqlDBM: PostgreSQL ****************;
-- ***************************************************;


-- ************************************** "public".competitor_filters

CREATE TABLE "public".competitor_filters
(
 filter_id              bigint NOT NULL,
 type                   varchar(6) NOT NULL,
 field                  text NOT NULL,
 matcher                text NOT NULL,
 value                  text NOT NULL,
 competitor_settings_id uuid NOT NULL,
 CONSTRAINT PK_competitor_filters PRIMARY KEY ( filter_id ),
 CONSTRAINT FK_comp_settings_to_filters FOREIGN KEY ( competitor_settings_id ) REFERENCES "public".competitor_settings ( competitor_settings_id ),
 CONSTRAINT check_filter_type CHECK ( type = 'base' or type = 'or' or type = 'and' or type = 'not' ),
 CONSTRAINT check_matcher_type CHECK ( matcher = 'exactly' )
);

CREATE INDEX fkIdx_139 ON "public".competitor_filters
(
 competitor_settings_id
);

COMMENT ON TABLE "public".competitor_filters IS 'Contains the actual filters used on competitors.
ENUM the type field and matcher field.';

COMMENT ON COLUMN "public".competitor_filters.type IS '"base" - means first condition applied
"or" - mean "or this condition applies"
"and" - mean "and this condition applies"';
COMMENT ON COLUMN "public".competitor_filters.field IS 'Field in data to match for';
COMMENT ON COLUMN "public".competitor_filters.matcher IS 'What the type of match it is, "is exactly" or "contains" etc. By match, we mean how the field we are filtering by is compared to the value stored for that field in the competitor.

Use an ENUM.';
COMMENT ON COLUMN "public".competitor_filters.value IS 'Value to look for';

COMMENT ON CONSTRAINT FK_comp_settings_to_filters ON "public".competitor_filters IS 'The competitor setting this is for';




