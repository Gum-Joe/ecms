import { Knex } from "knex";


/**
 * Set the default match score to 0
 */
export async function up(knex: Knex): Promise<void> {
	await knex.raw(`
        ALTER TABLE matches ALTER COLUMN team_1_score SET DEFAULT 0;
        ALTER TABLE matches ALTER COLUMN team_2_score SET DEFAULT 0;
        ALTER TABLE matches ALTER COLUMN locked SET DEFAULT FALSE;
    `);
}


export async function down(knex: Knex): Promise<void> {
	await knex.raw(`
        ALTER TABLE matches ALTER COLUMN team_1_score DROP DEFAULT;
        ALTER TABLE matches ALTER COLUMN team_2_score DROP DEFAULT;
        ALTER TABLE matches ALTER COLUMN locked DROP DEFAULT;
    `);
}

