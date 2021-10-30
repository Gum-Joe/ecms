// @generated
// Automatically generated. Don't change this file manually.

import { competitorsId } from './competitors';
import { competitor_settingsId } from './competitor_settings';

/**
 * For linking events to competitors. TO prevent this having many, many entires, use this only for:
1. discretely set or imported competitors
2. a cache of the filtered competitors (generated when filters run)

Use the specific additionas and removals table for additions and removals.
 */
export default interface join_competitor_events_group {
  /** Index: fkidx_149 */
  competitor_id: competitorsId;

  /** Index: fkidx_347 */
  competitor_settings_id: competitor_settingsId;
}

/**
 * For linking events to competitors. TO prevent this having many, many entires, use this only for:
1. discretely set or imported competitors
2. a cache of the filtered competitors (generated when filters run)

Use the specific additionas and removals table for additions and removals.
 */
export interface join_competitor_events_groupInitializer {
  /** Index: fkidx_149 */
  competitor_id: competitorsId;

  /** Index: fkidx_347 */
  competitor_settings_id: competitor_settingsId;
}
