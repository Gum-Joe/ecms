import { Knex } from "knex";

/**
 * Set `serial` as default for columns where I forgot to do this
 */
export async function up(knex: Knex): Promise<void> {
	await knex.raw(`
	CREATE SEQUENCE competitor_filters_filter_id_seq;
	ALTER TABLE competitor_filters
		ALTER COLUMN filter_id SET NOT NULL;
	ALTER TABLE competitor_filters
		ALTER COLUMN filter_id
		SET DEFAULT nextval('competitor_filters_filter_id_seq');
	ALTER SEQUENCE competitor_filters_filter_id_seq OWNED BY competitor_filters.filter_id;
	`);
}


export async function down(knex: Knex): Promise<void> {}

