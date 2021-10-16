// @generated
// Automatically generated. Don't change this file manually.

import { points_settingsId } from './points_settings';
import { teamsId } from './teams';

export type store_overall_pointsId = string & { " __flavor"?: 'store_overall_points' };

/**
 * Overall, i.e. per team, points
 */
export default interface store_overall_points {
  /** Index: fkidx_262 */
  points_settings_id: points_settingsId;

  /** Primary key. Index: pk_store_overall_points */
  overall_points_id: store_overall_pointsId;

  /** Index: fkidx_265 */
  team_id: teamsId;

  points: string;

  /** Running total of points so far - automatically calculated regardless of points system.

Field should be the same as "points" if not a group. */
  sum_points: string;

  /** Set to true if this has been overridden manually.
If true, do not overwrite the points or sum_points stored here. */
  overriden: boolean;
}

/**
 * Overall, i.e. per team, points
 */
export interface store_overall_pointsInitializer {
  /** Index: fkidx_262 */
  points_settings_id: points_settingsId;

  /**
   * Default value: gen_random_uuid()
   * Primary key. Index: pk_store_overall_points
   */
  overall_points_id?: store_overall_pointsId;

  /** Index: fkidx_265 */
  team_id: teamsId;

  points: string;

  /** Running total of points so far - automatically calculated regardless of points system.

Field should be the same as "points" if not a group. */
  sum_points: string;

  /**
   * Set to true if this has been overridden manually.
If true, do not overwrite the points or sum_points stored here.
   * Default value: false
   */
  overriden?: boolean;
}
