/**
 * Props for the content of event entry pages to accept
 */
export interface EntryComponentProps {
	/** Id of event entry is for */
	eventId: string;
	/** The ID of the form the "Save" button in the container DataEntryRenderer is bound to */
	formID: string;
}