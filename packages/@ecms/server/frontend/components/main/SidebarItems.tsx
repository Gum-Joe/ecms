import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { FluentTreeItem } from "../fluent";
import { ResEventsGroupsList } from "@ecms/api/common";
import { SidebarProps } from "./SidebarProps";

/**
 * Item in homepage sidebar.
 * Used to recursively fetch child events of groups.
 */
export const SidebarItems: React.FC<SidebarProps> = (props) => {
	const [eventAndGroupsList, seteventAndGroupsList] = useState<ResEventsGroupsList>([]);

	// Run a fetch
	useEffect(() => {
		fetch(`/api/common/list?fromId=${props.eventGroupId}`)
			.then(response => response.json())
			.then(data => seteventAndGroupsList(data))
			.catch((err) => {
				console.error(err);
			});
	}, [props.eventGroupId]);

	const history = useHistory();

	return (
		<>
			{eventAndGroupsList.map((eventOrGroup, index) => {
				if (eventOrGroup.type === "group") {
					// FIXME: Make it so it just focuses on the first slot
					return (
						<FluentTreeItem onClick={() => history.push(`/view/${eventOrGroup.event_group_id}`)} key={index}>
							{eventOrGroup.name}
							<SidebarItems eventGroupId={eventOrGroup.event_group_id} />
						</FluentTreeItem>
					);
				} else {
					return (
						<FluentTreeItem onClick={() => history.push(`/view/${eventOrGroup.event_group_id}`)} key={index}>
							{eventOrGroup.name}
						</FluentTreeItem>
					);
				}
			})}
		</>
	);
};
