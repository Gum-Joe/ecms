/**
 * Contains the RBAC roles users can have in ECMS
 * @packageDocumentation
 */
import { rolesInitializer } from "@ecms/models";

export type RolesNode = Omit<rolesInitializer, "path"> & {
	subroles?: Record<string, RolesNode>;
}

/**
 * Contains the full list of RBAC roles users can have in ECMS,
 * in a tree structure that shows hiow roles are nested.
 * 
 * By granting a role, all child roles below it are also granted.
 * 
 * We use this structure so we can easily generate the tree paths from it for the "path" key of the roles table.
 * 
 * **NOTE:** You must to rerun the database seeds (`yarn run knex seed:run`) after editing this! 
 */
const roles: Record<string, RolesNode> = {
	root: {
		name: "Superadmin",
		description: "grants all permissions",
		has_parameter: false,
		subroles: {
			admin: {
				name: "Admin",
				description: "access to the admin panel",
				has_parameter: false,
				subroles: {
					users: {
						name: "Users",
						description: "add and edit and remove users and user groups",
						has_parameter: false,
						subroles: {
							modify: {
								name: "Add & modify",
								description: "add and edit, but not remove, users and user groups",
								has_parameter: false,
							},
							delete: {
								name: "Delete",
								description: "remove users and user groups",
								has_parameter: false,
							}
						}
					},
					config: {
						name: "Config",
						description: "modify the configuration of the server (including API keys)",
						has_parameter: false,
					},
					updates: {
						name: "Updates",
						description: "Update the server (excludes installed extensions)",
						has_parameter: false
					},
					extensions: {
						name: "Extensions",
						description: "install, update and remove extensions",
						has_parameter: false,
						subroles: {
							update: {
								name: "Update",
								description: "update extensions",
								has_parameter: false,
							},
							install: {
								name: "Install new",
								description: "install new extensions",
								has_parameter: false,
							},
							delete: {
								name: "Delete",
								description: "remove extensions",
								has_parameter: false,
							}
						}
					}
				}
			},
			records: {
				name: "Records",
				description: "access to the Records that are stored",
				has_parameter: false,
				subroles: {
					view: {
						name: "View",
						description: "view Records",
						has_parameter: false,
					},
					modify: {
						name: "Modify",
						description: "create and edit Records",
						has_parameter: false,
					},
					delete: {
						name: "Delete",
						description: "delete Records",
						has_parameter: false,
					}
				}
			},
			/**
			 * For security reasons, we recommended granting the events roles below per event/group
			 * You can do this using the “Users” tab in the event configurator - e.g. to grant Sports Day helpers access to the events they are helping with.
			 * 
			 * We reccomend only setting the below roles site-wide (i.e. from the admin panel) for PE Staff, the Senior Leadership Team, Admins and the House Masters.
			 */
			events: {
				name: "Events",
				description: "access to everything event/group related, for all events/group",
				has_parameter: true,
				subroles: {
					modify: {
						name: "Modify",
						description: "create and edit all events/groups, including all settings",
						has_parameter: true,
						subroles: {
							entry: {
								name: "Entry of competitors or teams",
								description: "add competitors or teams to ALL events/groups",
								has_parameter: true,
							}
						}
					},
					delete: {
						name: "Delete",
						description: "delete any event/group",
						has_parameter: true,
					},
					archive: {
						name: "Archive",
						description: "archive any event/group",
						has_parameter: true,
					},
					entry: {
						name: "Data Entry",
						description: "enter data for ANY event/group - grants access to the “Data Entry” UI",
						has_parameter: true,
					},
					read: {
						name: "Read",
						description: "read ALL data from ALL events/groups",
						has_parameter: true,
						subroles: {
							settings: {
								name: "Settings",
								description: "read basic details & settings from events/groups. and any matches (but not their results)",
								has_parameter: true,
							},
							sensitive: {
								name: "Full competitor data",
								description: "read all competitor data for all events/groups.  May include sensitive data that was imported.",
								has_parameter: true,
							},
							results: {
								name: "Results",
								description: "read event/group results, such as how competitors have performed (points) or match results, as well as if any records were broken.",
								has_parameter: true,
							},
							export: {
								name: "Export",
								description: "export data from ANY event/group",
								has_parameter: true,
							}
						}
					}
				}
			}
		}
	}
};

export default roles;