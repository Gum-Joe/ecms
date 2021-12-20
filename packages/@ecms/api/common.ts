/**
 * Common type
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