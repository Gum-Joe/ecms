// @generated
// Automatically generated. Don't change this file manually.

import { public_dashboard_presetsId } from './public_dashboard_presets';

export type public_dashboardsId = string & { " __flavor"?: 'public_dashboards' };

/**
 * Settings for the public dashboards, specific to an event/group
 */
export default interface public_dashboards {
  /** Primary key. Index: pk_public_dashboard */
  public_dashboard_id: public_dashboardsId;

  preset_id: public_dashboard_presetsId;

  config: unknown;
}

/**
 * Settings for the public dashboards, specific to an event/group
 */
export interface public_dashboardsInitializer {
  /**
   * Default value: gen_random_uuid()
   * Primary key. Index: pk_public_dashboard
   */
  public_dashboard_id?: public_dashboardsId;

  preset_id: public_dashboard_presetsId;

  config: unknown;
}
