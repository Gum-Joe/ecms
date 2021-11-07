import React from "react";
/**
 * Full width card that takes up the full widht of its container.
 * Appplies some padding, but other than that is just a container
 */
const Card: React.FC = (props) => {
	return (
		<div className="ecms-card">
			{props.children}
		</div>
	);
};

export default Card;