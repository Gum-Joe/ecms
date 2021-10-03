/** 
 * Sets up the database structure using the SQL in sql/
 * so we can use the database tables we want to use
 * @packageDocumentation
 */

import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {

	// TODO: Replace with execution of SQLDBM generated SQL from the ERD.

	// Deletes ALL existing entries
	await knex("table_name").del();

	// Inserts seed entries
	await knex("table_name").insert([
		{ id: 1, colName: "rowValue1" },
		{ id: 2, colName: "rowValue2" },
		{ id: 3, colName: "rowValue3" }
	]);
}
