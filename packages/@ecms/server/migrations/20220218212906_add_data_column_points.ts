import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
	// Basically written by GH Co-pilot
	await knex.raw(`
		ALTER TABLE store_overall_points
			ADD data jsonb NOT NULL DEFAULT '{}'::jsonb;
	`);
}


export async function down(knex: Knex): Promise<void> {
}

