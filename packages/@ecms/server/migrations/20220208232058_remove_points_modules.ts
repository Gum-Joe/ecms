import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
	await knex.raw(`
		ALTER TABLE points_settings 
			DROP CONSTRAINT IF EXISTS FK_points_modules;
		DROP TRIGGER IF EXISTS points_system_module_check
			ON points_settings;
		ALTER TABLE points_settings 
			ALTER COLUMN module_id TYPE text;
	`);
}


export async function down(knex: Knex): Promise<void> {
}

