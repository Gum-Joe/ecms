import React from "react";

/**
 * Save button (for data entry)
 */
const SaveButton: React.FC = (props) => {
	return (
		<button className="green-button">
			{props.children}
		</button>
	);
};

export default SaveButton;