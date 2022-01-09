import { events_and_groupsId } from "@ecms/models";
import { createContext } from "react";

export type eventGroupIdContext = events_and_groupsId | undefined;

/**
 * Used to share the ID of the currently active event/group with the rest of the homepage content
 */
const HomepageEventGroupID = createContext<eventGroupIdContext>(undefined);

export default HomepageEventGroupID;