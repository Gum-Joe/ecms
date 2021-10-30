// @generated
// Automatically generated. Don't change this file manually.

/** What type of match this is:
- discrete - competitors directly set/imported - query the competitors join table with the event_group_id from event_group_id
- inherit - all the competitors from the parent_id of event_group_id  contains
- filter_parent: competitors filtered from the parent (parent_id). Either query the join table, or run the filters directly (latter recommended) */
type competitor_setting_types = 'discrete' | 'inherit' | 'filter_parent';
export default competitor_setting_types;
