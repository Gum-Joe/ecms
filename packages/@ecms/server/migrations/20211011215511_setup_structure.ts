/**
 * Sets up the database structure using the SQL in sql/
 * so we can use the database tables we want to use
 * @packageDocumentation
 */

import { Knex } from "knex";
import { promises as fs } from "fs";
import { join } from "path";

/** Base dir where SQL Scripts are stored */
const SQL_BASE_DIR = join(__dirname, "sql");

/**
 * Provisions the database for us.
 *
 * Does this by running through the scripts in `./sql/` based on the numerical order from their prefix
 * and running them directly.
 */
export async function up(knex: Knex): Promise<void> {
	console.log("Running DB provisions scripts...");
	const fileList = await fs.readdir(SQL_BASE_DIR);

	for (const fileName of fileList) {
		if (fileName.endsWith(".sql")) {
			// Valid script to run
			const sqlToRun = await fs.readFile(join(SQL_BASE_DIR, fileName));
			console.log(`Running script ${fileName}...`);
			await knex.raw(sqlToRun.toString());
		} else {
			continue;
		}
	}
}

/**
 * Drop literally everything. **Keep this up to date.**
 * 
 * WARNING: This will delete any data in the DB.
 * */
export async function down(knex: Knex): Promise<void> {
	const tables = [
		"join_users_groups",
		"join_roles_user_groups",
		"join_roles_users",
		"join_restrictions_events",
		"join_competitor_events_group",
		"join_events_groups_teams",
		"data_source_keys",
		"data_sources",
		"restrictions",
		"matches",
		"events_and_groups",
		"event_only_settings",
		"store_overall_points",
		"points_settings",
		"competitor_filters",
		"competitor_data",
		"competitor_edits",
		"competitor_removals",
		"competitor_additions",
		"competitors",
		"competitor_settings",
		"teams",
		"public_dashboards",
		"public_dashboard_presets",
		"records",
		"record_group",
		"data_units",
		"installed_modules",
		"roles",
		"user_groups",
		"users",
	];
	
	// Drop each table in turn:
	await Promise.all(tables.map(async (tableName) => {
		console.log(`Dropping ${tableName}...`);
		return knex.raw(`DROP TABLE IF EXISTS "${tableName}" CASCADE`);
	}));

	// Finally, drop types:
	// (make sure to keep these are update!)
	await knex.raw(`
	DROP TYPE IF EXISTS event_or_group;
	DROP TYPE IF EXISTS trackable_data;
	DROP TYPE IF EXISTS extension_types;
	DROP TYPE IF EXISTS extension_install_sources;
	DROP TYPE IF EXISTS login_types;
	DROP TYPE IF EXISTS filter_types;
	DROP TYPE IF EXISTS filter_matchers;
	DROP TYPE IF EXISTS competitor_setting_types;
	
	DROP FUNCTION IF EXISTS check_module_is_points_system CASCADE;
	DROP FUNCTION IF EXISTS check_data_tracked_is_individual_if_unit CASCADE;
	DROP FUNCTION IF EXISTS check_if_group CASCADE;
	DROP FUNCTION IF EXISTS check_if_event CASCADE;
	DROP FUNCTION IF EXISTS matches_event_type_check CASCADE;
	DROP FUNCTION IF EXISTS restrictions_check_if_group CASCADE;
	DROP FUNCTION IF EXISTS data_source_module_check CASCADE;
	DROP FUNCTION IF EXISTS check_if_event_id_is_event CASCADE;
	DROP FUNCTION IF EXISTS check_param_set_only CASCADE;
	`);

	//  
}

