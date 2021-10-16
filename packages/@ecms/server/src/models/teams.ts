// @generated
// Automatically generated. Don't change this file manually.

export type teamsId = string & { " __flavor"?: 'teams' };

/**
 * Stores the teams we have for all event/groups.
Allows us to also share the same teams between event/groups without duplicating them.
 */
export default interface teams {
  /** Primary key. Index: pk_teams */
  team_id: teamsId;

  name: string;

  /** Hex of colour to use for team. Include the # in the colour. */
  colour: string;
}

/**
 * Stores the teams we have for all event/groups.
Allows us to also share the same teams between event/groups without duplicating them.
 */
export interface teamsInitializer {
  /**
   * Default value: gen_random_uuid()
   * Primary key. Index: pk_teams
   */
  team_id?: teamsId;

  name: string;

  /** Hex of colour to use for team. Include the # in the colour. */
  colour: string;
}
