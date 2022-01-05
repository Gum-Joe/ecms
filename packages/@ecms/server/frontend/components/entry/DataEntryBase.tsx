import React from "react";

/**
 * Use this as the base component that a data entry UI falls in
 * @param name Name of the data entry type, included in the header of it
 */
export const DataEntryBase: React.FC<{ className: string; name: string; subtitle?: string }> = (props) => {
	return (
		<div className={`entry-renderer ${props.className}`}>
			<h1 className="sub-header">{props.name}</h1>
			<p>{props.subtitle || "You may need to scroll to see all items" }</p>
			{props.children}
		</div>
	);
};
