import { Knex } from "knex";

/** Add "points" as a valid data tracked type for event */

export async function up(knex: Knex): Promise<void> {
	await knex.raw(`
ALTER TYPE trackable_data ADD VALUE 'points';
COMMENT ON TYPE trackable_data IS 'The data an event can track, crucial in determining its type. CONSTRAIN to just "matches" | "individual" | "none". Mutually exclusive options.

"matches": allow matches to be tracked. REQUIRES enable_teams to be true in event_settings_id
"individual": Individual performance of competitor information is tracked.
"none": no data is tracked.
"points": points awarded to teams in the event (and no other data) is tracked (added by migration)';
	`);
}


export async function down(knex: Knex): Promise<void> {
	// Irreversible
}

