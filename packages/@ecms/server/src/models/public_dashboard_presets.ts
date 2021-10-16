// @generated
// Automatically generated. Don't change this file manually.

export type public_dashboard_presetsId = string & { " __flavor"?: 'public_dashboard_presets' };

/**
 * Stores the names of public dashboard presets.
 */
export default interface public_dashboard_presets {
  /** Primary key. Index: pk_public_dashboard_presets */
  preset_id: public_dashboard_presetsId;

  name: string;
}

/**
 * Stores the names of public dashboard presets.
 */
export interface public_dashboard_presetsInitializer {
  /**
   * Default value: gen_random_uuid()
   * Primary key. Index: pk_public_dashboard_presets
   */
  preset_id?: public_dashboard_presetsId;

  name: string;
}
