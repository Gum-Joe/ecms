/**
 * Utility types for competitor CSV handling
 * @packageDocumentation
 */

import { CompetitorCSVMetadataColumns, CompetitorCSVMetatdata } from "@ecms/api/setup";
import { CSVResult as CSVResultImported } from "@ecms/api/common";

/**
 * What a parsed CSV should look like
 */
export type CSVResult = CSVResultImported;
/** ECMS required columns */
export type ColumnsToGet = CompetitorCSVMetadataColumns;
/** How columns are stored when collecting which column indices correspond to each {@link ColumnsToGet}. Use `-1` for not set. */
export type ColumnsToGetRecord = CompetitorCSVMetatdata;