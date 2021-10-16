// @generated
// Automatically generated. Don't change this file manually.

import { competitor_settingsId } from './competitor_settings';
import { competitorsId } from './competitors';

/**
 * Records edits made to competitor information in events/group which have inherited or filtered from parent. Done by relating the original record to a new record that contains the edits - in the future, later edits to the original can be copied to edited_competitor.

When querying, remove and replace original_competitor with edited_competitor
 */
export default interface competitor_edits {
  /** Index: fkidx_111_clone_clone */
  competitor_settings_id: competitor_settingsId;

  /**
   * Points to the UUID of the record that stores the data about the edited competitor
   * Index: fkidx_114_clone_clone
   */
  edited_competitor: competitorsId;

  /**
   * Original competitor that was edited
   * Index: fkidx_127
   */
  original_competitor: competitorsId;
}

/**
 * Records edits made to competitor information in events/group which have inherited or filtered from parent. Done by relating the original record to a new record that contains the edits - in the future, later edits to the original can be copied to edited_competitor.

When querying, remove and replace original_competitor with edited_competitor
 */
export interface competitor_editsInitializer {
  /** Index: fkidx_111_clone_clone */
  competitor_settings_id: competitor_settingsId;

  /**
   * Points to the UUID of the record that stores the data about the edited competitor
   * Index: fkidx_114_clone_clone
   */
  edited_competitor: competitorsId;

  /**
   * Original competitor that was edited
   * Index: fkidx_127
   */
  original_competitor: competitorsId;
}
