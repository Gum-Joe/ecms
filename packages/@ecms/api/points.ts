/**
 * Describes the interfaces for all the different points systems' settings objects.
 * @packageDocumentation
 */

export enum OrderingOptions {
	/** Lower results are better (e.g. time to do a length) */
	LOWER = "LOWER",
	/** Higher results are better (e.g. distance jumped) */
	HIGHER = "HIGHER"
}

export interface Threshold {
	/** The actual result, i.e. data entered for a competitor */
	result: number;
	/** Points to award competitor */
	points: number;
	/** Grade to award */
	grade: string;
}

/**
 * Points system that works based off whether competitors' performance is above or below certain levels,
 * which each level awarding some number of points
 */
export interface PointsThresholds {
	/** Whether lower or higher results are better */
	setting: OrderingOptions;
	/** Thresholds to use when judging scores (best to assume NOT sorted!) */
	thresholds: Threshold[]
}

/**
 * Ranked scoring system. Awards points based on rank.
 */
export interface PointsRanked {
	/** Here, {@link OrderingOptions.LOWER} means lower performance metrics get a higher rank, and {@link OrderingOptions.HIGHER} means higher performance metrics get a higher rank */
	setting: OrderingOptions;
	/**
	 * ORDERED list of points to award each rank.
	 * List length is number of ranks provided - assume zero points for ranks beyond its ength.
	 * Index 0 here is 1st place.
	 */
	points: number[];
}

/** Scoring for matches */
export interface PointsMatches {
	/** Points to a team for a win */
	win: number;
	/** Points to a team for a loss */
	loss: number;
	/** Points to a team for a draw */
	draw: number;
}

/**
 * Amagamtor - awards points based on the ranking of teams in their total points.
 */
export interface PointsAmalgamator {
	/**
	 * Here, {@link OrderingOptions.LOWER} means lower performance metrics get a higher rank, and {@link OrderingOptions.HIGHER} means higher performance metrics get a higher rank.
	 * By default higher points should be awarded a higher rank (and so more points)
	 */
	setting: OrderingOptions;
	/**
	 * ORDERED list of points to award each rank.
	 * List length is number of ranks provided - assume zero points for ranks beyond its ength.
	 * Index 0 here is 1st place.
	 */
	points: number[];
}

/**
 * Output the running total of points for a group.
 * No settings.
 */
export type PointsRunningTotal = Record<never, string>;
