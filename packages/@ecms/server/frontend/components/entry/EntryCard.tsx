import React from "react";

/**
 * A card used to show data in the ECMS entry UI
 */
const EntryCard: React.FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>> = (props) => {
	return (
		<div {...props} className={"entry-card " + (props.className || "")}>
			{props.children}
		</div>
	);
};

export default EntryCard;