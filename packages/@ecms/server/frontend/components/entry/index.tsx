import React from "react";
import CHBBlurredBG from "../common/AcrylicBackground";
import BottomBar from "./BottomBar";
import List from "./List";

/**
 * Router for data entry code
 */
const DataEntry: React.FC = () => {
	return (
		<CHBBlurredBG className="entry-page">
			<List />
			<BottomBar />
		</CHBBlurredBG>
	);
};

export default DataEntry;