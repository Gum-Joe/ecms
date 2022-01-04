import React from "react";

/**
 * Save button (for data entry)
 */
const SaveButton: React.FC<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>> = (props) => {
	return (
		<button {...props} className={"green-button" + (props?.className || "")}>
			{props.children}
		</button>
	);
};

export default SaveButton;