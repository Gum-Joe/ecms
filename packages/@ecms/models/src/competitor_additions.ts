// @generated
// Automatically generated. Don't change this file manually.

import { competitor_settingsId } from './competitor_settings';
import { competitorsId } from './competitors';

/**
 * Contains specific additions to competitors that are not present in parent groups (i.e. added at that level rather than in the parent as you should)
 */
export default interface competitor_additions {
  /** Index: fkidx_111 */
  competitor_settings_id: competitor_settingsId;

  /** Index: fkidx_114 */
  competitor_id: competitorsId;
}

/**
 * Contains specific additions to competitors that are not present in parent groups (i.e. added at that level rather than in the parent as you should)
 */
export interface competitor_additionsInitializer {
  /** Index: fkidx_111 */
  competitor_settings_id: competitor_settingsId;

  /** Index: fkidx_114 */
  competitor_id: competitorsId;
}
