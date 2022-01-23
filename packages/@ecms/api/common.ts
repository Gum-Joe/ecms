/**
 * Common type
 * @packageDocumentation
 */

import { events_and_groups } from "@ecms/models";

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

/**
 * Response when requesting a list of event and groups
 */
export type ResEventsGroupsList = Pick<events_and_groups, "name" | "description" | "type" | "event_group_id" | "parent_id" | "complete" | "archived">[];

/**
 * Defines descriptions of fields in competitors
 * @template ValidFields Union type of valid fields
 */
export interface FieldDescriptor<ValidFields extends string = string>{
	name: ValidFields;
	values: string[];
}

/**
 * Returns fields of competitor for a particular event
 */
export interface ResCompetitorFields {
	/** These are fields provided by the database directly, that we are able to use */
	defaults: FieldDescriptor<"Team">[];
	/** These are fields extracted from data */
	fields: FieldDescriptor[];
	/** Simple list of fields in {@link ResCompetitorFields.fields} so you don't have to loop through the long list. Indexes should match. */
	flattenedList: string[];
}