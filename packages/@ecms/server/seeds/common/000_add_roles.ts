import { Knex } from "knex";
import { rolesInitializer } from "@ecms/models";
import roles, { RolesNode } from "../../src/utils/roles";

/**
 * Provision the roles tables with all the roles
 */
export async function seed(knex: Knex): Promise<void> {
	// Deletes ALL existing entries
	await knex("join_roles_users").del();
	await knex("roles").del();

	console.log("Generating roles to load into server...");
	const rolesGen = generateRoles(roles);

	// Now for each, insert!
	await knex("roles").insert<rolesInitializer>(
		rolesGen
	);
}

function generateRoles(rolesList: Record<string, RolesNode>, prefixIn = ""): rolesInitializer[] {
	let rolesGenerated: rolesInitializer[] = [];
	const prefix = prefixIn === "" ? "" : prefixIn + ".";
	for (const roleName in rolesList) {
		if (Object.prototype.hasOwnProperty.call(rolesList, roleName)) {
			const currentRole = rolesList[roleName];
			console.log(`Generating role ${prefix}${roleName}`);
			rolesGenerated.push({
				name: currentRole.name,
				description: currentRole.description,
				has_parameter: currentRole.has_parameter,
				path: prefix + roleName,
			});
			if (currentRole.subroles) {
				// Go recrusive
				rolesGenerated = [
					...rolesGenerated,
					...(generateRoles(currentRole.subroles, prefix + roleName))
				];
			}
		}
	}

	return rolesGenerated;
}

