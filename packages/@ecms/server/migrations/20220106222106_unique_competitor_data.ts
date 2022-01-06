import { Knex } from "knex";

/**
 * Ensure the combo on competitor_id and competitor_settings_id is unqiue so only one piece of data can be stored per competitor per event
 */
export async function up(knex: Knex): Promise<void> {
	await knex.raw(`
		ALTER TABLE competitor_data
		ADD CONSTRAINT competitor_data_unique UNIQUE (competitor_id, competitor_settings_id);
	`);
}


export async function down(knex: Knex): Promise<void> {
	await knex.raw(`
		ALTER TABLE competitor_data
		DROP CONSTRAINT competitor_data_unique;
	`);
}

