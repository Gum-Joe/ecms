import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

interface LinkedNavListProps {
	icon: JSX.Element;
	linkTo: string;
	text: string;
}
/**
 * An indivudal item in a linked navigation list.
 *
 * A linked navigation list is one made up of several block items, separated by a gap,
 * that goes vertically down a page.
 * Each item has a corresponding icon, text and an arrow at the end to indicate it advances the user on to another page
 */
export const LinkedNavigationList: React.FC<LinkedNavListProps> = (props) => {
	return (
		<Link to={props.linkTo} className="linked-nav-list">
			{props.icon}
			<p>{props.text}</p>
			<FontAwesomeIcon icon={faArrowRight} id="list-end-nav" />
		</Link>
	);
};
/**
 * Container for linked navigation list,
 * used to control their spacing.
 *
 * A linked navigation list is one made up of several block items, separated by a gap,
 * that goes vertically down a page.
 * Each item has a corresponding icon, text and an arrow at the end to indicate it advances the user on to another page
 */
export const LinkedNavigationListContainer: React.FC = (props) => {
	return (
		<div className="linked-nav-list-container">
			{props.children}
		</div>
	);
};
