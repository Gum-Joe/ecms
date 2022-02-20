import { Knex } from "knex";


// Unique team entry for each point_settings_id!
export async function up(knex: Knex): Promise<void> {
	await knex.raw(`
		ALTER TABLE store_overall_points
		ADD CONSTRAINT unique_per_team UNIQUE (points_settings_id, team_id);
	`);
}


export async function down(knex: Knex): Promise<void> {
	await knex.raw(`
		ALTER TABLE store_overall_points
		DROP CONSTRAINT unique_per_team;
	`);
}
