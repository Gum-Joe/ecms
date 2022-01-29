// @generated
// Automatically generated. Don't change this file manually.

import { competitor_settingsId } from './competitor_settings';
import filter_types from './filter_types';
import filter_matchers from './filter_matchers';

export type competitor_filtersId = string & { " __flavor"?: 'competitor_filters' };

/** Fields reserved for use by ECMS */
export type competitor_reserved_fields = "Team";
export const COMPETITOR_RESERVED_FIELDS: Record<string, competitor_reserved_fields & string> = {
  teams: "Team",
};


/**
 * Contains the actual filters used on competitors.
ENUM the type field and matcher field.
 */
export default interface competitor_filters {
  /** Primary key. Index: pk_competitor_filters */
  filter_id: competitor_filtersId;

  /** "base" - means first condition applied
"or" - mean "or this condition applies"
"and" - mean "and this condition applies"
"not" - means "and this condition does NOT apply */
  type: filter_types;

  /** Field in data to match for */
  field: string;

  /** What the type of match it is, "is exactly" or "contains" etc. By match, we mean how the field we are filtering by is compared to the value stored for that field in the competitor. */
  matcher: filter_matchers;

  /** Value to look for */
  value: string;

  /** Index: fkidx_139 */
  competitor_settings_id: competitor_settingsId;
}

/**
 * Contains the actual filters used on competitors.
ENUM the type field and matcher field.
 */
export interface competitor_filtersInitializer {
  /** Primary key. Index: pk_competitor_filters */
  filter_id?: competitor_filtersId;

  /** "base" - means first condition applied
"or" - mean "or this condition applies"
"and" - mean "and this condition applies"
"not" - means "and this condition does NOT apply */
  type: filter_types;

  /** Field in data to match for */
  field: string;

  /** What the type of match it is, "is exactly" or "contains" etc. By match, we mean how the field we are filtering by is compared to the value stored for that field in the competitor. */
  matcher: filter_matchers;

  /** Value to look for */
  value: string;

  /** Index: fkidx_139 */
  competitor_settings_id: competitor_settingsId;
}
