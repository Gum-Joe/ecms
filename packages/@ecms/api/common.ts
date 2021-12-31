/**
 * Common type
 * @packageDocumentation
 */

/**
 * Basic API Response
 * Allows us to respond with an error message or some other message
 */
export interface APIMessage {
	/** Message string */
	message?: string;
}

/**
 * What a parsed CSV should look like
 */
export interface CSVResult {
	/** Headers of the CSV */
	headers: string[];
	/** 2D array of the data - use as `data[row][column]` */
	data: string[][];
}

/**
 * Status of a task in redis.
 * 
 * APIs may return these, hence why we set them here.
 * 
 * Also includes the `error` status, but this is included in {@link ErrorTaskStatus}
 */
export type TaskStatuses = "pending" | "in progress" | "done";


export interface GeneralTaskStatus<AdditionalStatus extends string> {
	status: TaskStatuses | AdditionalStatus,
}

/** Use this when a task error! */
interface ErrorTaskStatus {
	status: "error",
	/** Error message */
	error: string,
}

/**
 * How a task status should be represented in Redis
 * 
 * @template AdditionalStatus use this to add additional statuses to {@link GeneralTaskStatus.status}
 */
export type TaskStatus<AdditionalStatus extends string = "pending"> = GeneralTaskStatus<AdditionalStatus> | ErrorTaskStatus;