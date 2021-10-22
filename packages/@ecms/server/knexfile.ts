// Update with your config settings.
// TODO: Add actual config settings here
// Dependent on .env stuff
import dotenv from "dotenv";

/** Intitalise our config into environmntal variables */
dotenv.config();

// TODO: Configure the correct seeds here
const config = {
	
	// Local Docker Dev Env
	development: {
		client: "postgresql",
		connection: {
			host: process.env.ECMS_DB_HOSTNAME,
			port: process.env.ECMS_DB_PORT,
			database: process.env.ECMS_DB_DB,
			user: process.env.ECMS_DB_USERNAME,
			password: process.env.ECMS_DB_PASSWORD
		},
		seeds: {
			directory: ["./seeds/development", "./seeds/common"],
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

module.exports = config;