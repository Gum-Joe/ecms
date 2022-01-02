/**
 * Renders the appropriate data entry component for the given event type
 */
import { faArrowLeft, faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import CHBBlurredBG from "../common/AcrylicBackground";
import BottomBar from "./BottomBar";
import SaveButton from "./SaveButton";

const DataEntryRenderer: React.FC = (props) => {
	return (
		<CHBBlurredBG className="entry-page">
			<div>
				<h1>Data Entry</h1>
			</div>
			<BottomBar>
				<FontAwesomeIcon icon={faArrowLeft} />
				<SaveButton>Save</SaveButton>
				<FontAwesomeIcon icon={faEllipsisH} />
			</BottomBar>
		</CHBBlurredBG>
	);
};

export default DataEntryRenderer;
