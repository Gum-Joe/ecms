/**
 * Config for Kanel, the tool used to convert DB types to TS types
 * @packageDocumentation
 */

const path = require("path");
const dotenv = require("dotenv");

/** Intitalise our config into environmntal variables */
dotenv.config();

// From https://github.com/kristiandupont/kanel (process.env copied from knexfile.ts)
module.exports = {
	connection: {
		host: process.env.ECMS_DB_HOSTNAME,
		port: process.env.ECMS_DB_PORT,
		database: process.env.ECMS_DB_DB,
		user: process.env.ECMS_DB_USERNAME,
		password: process.env.ECMS_DB_PASSWORD
	},

	preDeleteModelFolder: true,

	customTypeMap: {
		ltree: "string",
		bpchar: "string",
		uuid: "string",
	},

	schemas: [
		{
			name: "public",
			ignore: ["knex_migrations", "knex_migrations_lock"], // Knex migration tables
			modelFolder: path.join(__dirname, "src", "models"),
		},
	],
};