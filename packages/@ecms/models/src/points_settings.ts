// @generated
// Automatically generated. Don't change this file manually.

import { installed_modulesId } from './installed_modules';

export type points_settingsId = string & { " __flavor"?: 'points_settings' };

/**
 * Stores settings for calculating points.
Lack of an entry here means none set.
 */
export default interface points_settings {
  /** Primary key. Index: pk_points */
  points_settings_id: points_settingsId;

  /** Config for the points system. Is what is provided to ecms.storeConfig() by the module. */
  config: unknown;

  /** The module that is the points system to use.
CONSTRAIN to type: "pointsSystem" in the installed_modules record */
  //module_id: installed_modulesId;
  module_id: string;
}

/**
 * Stores settings for calculating points.
Lack of an entry here means none set.
 */
export interface points_settingsInitializer {
  /**
   * Default value: gen_random_uuid()
   * Primary key. Index: pk_points
   */
  points_settings_id?: points_settingsId;

  /** Config for the points system. Is what is provided to ecms.storeConfig() by the module. */
  config: unknown;

  /** The module that is the points system to use.
CONSTRAIN to type: "pointsSystem" in the installed_modules record */
  //module_id: installed_modulesId;
  module_id: string;
}
