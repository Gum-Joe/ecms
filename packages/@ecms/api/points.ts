/**
 * Describes the interfaces for all the different points systems' settings objects.
 * @packageDocumentation
 */

import { events_and_groups, event_only_settings, store_overall_points } from "@ecms/models";

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

/** Data stored in the DB for matches scoring system under {@link store_overall_points.data} */
export interface TeamPoints {
	wins?: number;
	losses?: number;
	draws?: number;
	points?: number;
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

/** List of points systems */
export enum PointsSystems {
	THRESHOLDS = "thresholds",
	RANKED = "ranked",
	MATCHES = "matches",
	AMALGAMATOR = "amalgamator",
	RUNNING_TOTAL = "runningTotal"
}

export interface PointsSystemSpec {
	name: PointsSystems;
	displayName: string,
	description: string,
	/** A mask of setting to compare with. Set the values of setting that need to be set (e.g. enable_teams) to use this points system */
	validOn: {
		event_group_settings: Partial<events_and_groups>;
		event_only_settings?: Partial<event_only_settings>;
	}
}

/** List of points systems, display names and descriptions */
export const PointsSystemsDisplay: Array<PointsSystemSpec> = [
	{
		name: PointsSystems.THRESHOLDS,
		displayName: "Thresholds",
		description: "Awards & outputs points based on whether competitors' performance is above or below certain levels/values, with each level awarding some number of points",
		validOn: {
			event_group_settings: {
				type: "event",
				enable_teams: true,
			},
			event_only_settings: {
				data_tracked: "individual",
			}
		}
	},
	{
		name: PointsSystems.RANKED,
		displayName: "Ranks",
		description: "Awards & outputs points based on the ranking of competitors' performance",
		validOn: {
			event_group_settings: {
				type: "event",
				enable_teams: true,
			},
			event_only_settings: {
				data_tracked: "individual",
			}
		}
	},
	{
		name: PointsSystems.MATCHES,
		displayName: "Match Scoring",
		description: "Awards & outputs points based on the results of matches",
		validOn: {
			event_group_settings: {
				type: "event",
				enable_teams: true,
			},
			event_only_settings: {
				data_tracked: "matches",
			}
		}
	},
	{
		name: PointsSystems.AMALGAMATOR,
		displayName: "Point Amalgamator",
		description: "Awards & outputs points based on the ranking of teams' total points in all sub-events",
		validOn: {
			event_group_settings: {
				type: "group",
				enable_teams: true,
			}
		}
	},
	{
		name: PointsSystems.RUNNING_TOTAL,
		displayName: "Running Total",
		description: "Outputs the total points collected by each team in all sub-events - use for e.g. per year group competitions",
		validOn: {
			event_group_settings: {
				type: "group",
				enable_teams: true,
			}
		}
	},
];

/**
 * Map of Points systems to settings
 * @example ```ts
 * const pointsSettings: PointsSettingsFor[PointsSystems.THRESHOLDS] = { ...data }
 */
export interface PointsSettingsFor {
	[PointsSystems.THRESHOLDS]: PointsThresholds;
	[PointsSystems.RANKED]: PointsRanked;
	[PointsSystems.MATCHES]: PointsMatches;
	[PointsSystems.AMALGAMATOR]: PointsAmalgamator;
	[PointsSystems.RUNNING_TOTAL]: PointsRunningTotal;
}
