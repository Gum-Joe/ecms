import { Knex } from "knex";

/**
 * Alter the users table to have unique emails for oauth and local users (to prevcent duplicate users).
 * 
 * The same email can still have a local and oauth account associated with it,
 * but the unique constrant means they can only have 1 of each
 */
export async function up(knex: Knex): Promise<void> {
	knex.raw(`
		ALTER TABLE "public".users
			ADD CONSTRAINT user_unique_emails UNIQUE(email, auth_type);
	`);
}


export async function down(knex: Knex): Promise<void> {
	knex.raw(
		"DROP CONSTRAINT user_unique_emails;"
	);
}

