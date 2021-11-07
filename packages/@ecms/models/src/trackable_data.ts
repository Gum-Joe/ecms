// @generated
// Automatically generated. Don't change this file manually.

/** The data an event can track, crucial in determining its type. CONSTRAIN to just "matches" | "individual" | "none" | "points". Mutually exclusive options.

"matches": allow matches to be tracked. REQUIRES enable_teams to be true in event_settings_id
"individual": Individual performance of competitor information is tracked.
"none": no data is tracked.
"points": points awarded to teams in the event (and no other data) is tracked */
type trackable_data = 'matches' | 'individual' | 'none' | 'points';
export default trackable_data;
