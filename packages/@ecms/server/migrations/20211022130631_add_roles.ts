import { Knex } from "knex";
import { rolesInitializer as roles} from "../src/models/roles";

const roles: roles[] = [
  {
    name: "",
    path: "",
    description: "",
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

