import { events_and_groupsId } from "@ecms/models";

export interface SidebarProps {
	/**
	 * Id of the event or group this sidebar item is for. Null means get events/groups not in a group, i.e. 'root' events/group
	 */
	eventGroupId?: events_and_groupsId;
}
