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
export async function seed(knex: Knex): Promise<void> {
	console.log("Running DB provisions scripts...");
	const fileList = await fs.readdir(SQL_BASE_DIR);
	for (const fileName of fileList) {
		if (fileName.endsWith(".sql")) {
			// Valid script to run
			const sqlToRun = await fs.readFile(join(SQL_BASE_DIR, fileName));
			console.log(`Running script ${fileName}`);
			await knex.raw(sqlToRun.toString());
		} else {
			continue;
		}
	}
}
