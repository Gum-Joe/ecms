import { Knex } from "knex";
import { rolesInitializer as roles} from "../src/models/roles";

const roles: roles[] = [
  {
    name: "Superadmin",
    description: "Grants all permissions",
    path: "root",
    has_parameter: false,
  },
  {
    name: "Admin",
    description: "General Admin Activites",
    path: "root.admin",
    has_parameter: false,
  },
  {
    name: "Users",
    description: "Management of users of ECMS",
    path: "root.admin.users",
    has_parameter: false,
  },
  {
    name: "Add & modify users",
    description: "allows adding or modifying users and granting roles",
    path: "root.admin.users.modify",
    has_parameter: false,
  }
]

/**
 * Add the roles users can have (RBAC) to ECMS
 */
export async function up(knex: Knex): Promise<void> {
}


export async function down(knex: Knex): Promise<void> {
}

