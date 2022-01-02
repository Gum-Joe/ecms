import React from "react";

/**
 * Bottom navigation
 */
const BottomBar: React.FC = (props) => {
	return (
		<footer className="entry-bottom-nav">
			{props.children}
		</footer>
	);
};

export default BottomBar;