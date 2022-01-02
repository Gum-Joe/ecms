import { ResEventsGroupsList } from "@ecms/api/common";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

interface ListItemProps {
	name: string;
	onClick: () => void;
}

/**
 * An item in the list of events
 * @param props 
 * @returns 
 */
const ListItem: React.FC<ListItemProps> = (props) => {
	return (
		<div className="entry-list-item" onClick={props.onClick}>
			<p>{props.name}</p>
			<FontAwesomeIcon icon={faArrowRight} />
		</div>
	);
};

/**
 * Lists events that we can go into and do data entry in
 */
const List: React.FC = (props) => {
	const [eventAndGroupsList, seteventAndGroupsList] = useState<ResEventsGroupsList>([]);
	const history = useHistory();

	const handleRedirect = useCallback(
		(eventOrGroup: ResEventsGroupsList[0]) => {
			return () => {
				// Handle red
				if (eventOrGroup.type === "event") {
					history.push(`/entry/${eventOrGroup.event_group_id}`);
				}
			};
		},
		[history],
	);
	
	useEffect(() => {
		fetch("/api/common/list")
			.then(response => response.json())
			.then(data => seteventAndGroupsList(data))
			.catch((err) => {
				console.error(err);
			});
	}, []);

	return (
		<div className="entry-list">
			<h1 className="sub-header">Select an event</h1>
			<div className="entry-list-container">
				{
					eventAndGroupsList.map((eventOrGroup, index) => (<ListItem
						key={index}
						name={eventOrGroup.name}
						onClick={handleRedirect(eventOrGroup)}
					/>))
				}
			</div>
		</div>
	);
};

export default List;