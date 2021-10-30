// @generated
// Automatically generated. Don't change this file manually.

import { competitor_settingsId } from './competitor_settings';
import { competitorsId } from './competitors';

/**
 * Contains specific removals to competitors from e.g. inheritance. These are those specifically removed from an event/group.
 */
export default interface competitor_removals {
  /** Index: fkidx_111_clone */
  competitor_settings_id: competitor_settingsId;

  /** Index: fkidx_114_clone */
  competitor_id: competitorsId;
}

/**
 * Contains specific removals to competitors from e.g. inheritance. These are those specifically removed from an event/group.
 */
export interface competitor_removalsInitializer {
  /** Index: fkidx_111_clone */
  competitor_settings_id: competitor_settingsId;

  /** Index: fkidx_114_clone */
  competitor_id: competitorsId;
}
