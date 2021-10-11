// Update with your config settings.
// TODO: Add actual config settings here
// Dependent on .env stuff

// TODO: Configure the correct seeds here
module.exports = {
	
	// Local Docker Dev Env
	development: {
		client: "postgresql",
		connection: {
			host: "localhost",
			port: 5434,
			database: "ecms", // Maybe change this
			// TODO: Change to .env file
			user: process.env.POSTGRES_USERNAME,
			password: process.env.POSTGRES_PASSWORD
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
