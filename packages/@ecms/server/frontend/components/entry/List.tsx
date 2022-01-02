import { ResEventsGroupsList } from "@ecms/api/common";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";

interface ListItemProps {
	name: string;
}

/**
 * 
 * @param props 
 * @returns 
 */
const ListItem: React.FC<ListItemProps> = (props) => {
	return (
		<div className="entry-list-item">
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
					eventAndGroupsList.map((eventOrGroup, index) => (<ListItem key={index} name={eventOrGroup.name} />))
				}
			</div>
		</div>
	);
};

export default List;