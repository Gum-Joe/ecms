/**
 * Utility types for competitor CSV handling
 * @packageDocumentation
 */

/**
 * What a parsed CSV should look like
 */
export interface CSVResult {
	/** Headers of the CSV */
	headers: string[];
	/** 2D array of the data - use as `data[row][column]` */
	data: string[][];
}
/** ECMS required columns */
export type ColumnsToGet = "nameIndex" | "teamIndex" | "yearGroupIndex";
/** How columns are stored when collecting which column indices correspond to each {@link ColumnsToGet}. Use `-1` for not set. */
export type ColumnsToGetRecord = Record<ColumnsToGet, number>;