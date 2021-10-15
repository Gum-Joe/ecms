// Update with your config settings.
// TODO: Add actual config settings here
// Dependent on .env stuff
import dotenv from "dotenv";
import "@ecms/core/src/config";

/** Intitalise our config into environmntal variables */
dotenv.config();

// TODO: Configure the correct seeds here
module.exports = {
	
	// Local Docker Dev Env
	development: {
		client: "postgresql",
		connection: {
			host: process.env.ECMS_DB_HOSTNAME,
			port: process.env.ECMS_DB_PORT,
			database: process.env.ECMS_DB_DB, // Maybe change this
			user: process.env.ECMS_DB_USERNAME,
			password: process.env.ECMS_DB_PASSWORD
		},
	},

	staging: {
		client: "postgresql",
		connection: {
			database: "my_db",
			user: "username",
			password: "password"
		},
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			tableName: "knex_migrations"
		}
	},

	production: {
		client: "postgresql",
		connection: {
			database: "my_db",
			user: "username",
			password: "password"
		},
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			tableName: "knex_migrations"
		}
	}

};
