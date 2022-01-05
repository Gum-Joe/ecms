/**
 * Renders the appropriate data entry component for the given event type
 */
import { event_only_settings } from "@ecms/models";
import { faArrowLeft, faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CHBBlurredBG from "../common/AcrylicBackground";
import { MatchEntry } from "./MatchEntry";
import BottomBar from "./BottomBar";
import SaveButton from "./SaveButton";
import CompetitorEntry from "./CompetitorEntry";
import { fetchEventOnlyInfo } from "./util";

const DataEntryRenderer: React.FC = (props) => {

	const [eventInfo, seteventInfo] = useState<event_only_settings>();
	const { id } = useParams<{ id: string }>();
	// Retrieve the event info
	useEffect(() => {
		fetchEventOnlyInfo(id, seteventInfo);
	}, [id]);

	const getEntryPage = useCallback(
		(formID: string) => {
			switch (eventInfo?.data_tracked) {
				case "matches":
					return <MatchEntry eventId={id} formID={formID} />;
				case "individual":
					return <CompetitorEntry eventId={id} formID={formID} />;
				default:
					return <div className={"entry-renderer"}>
						<h1 className="sub-header">Loading...</h1>
					</div>;
			}
		},
		[eventInfo?.data_tracked, id],
	);

	const formID = "entry-submission-form";
	return (
		<CHBBlurredBG className="entry-page">
			{
				getEntryPage(formID)
			}
			<BottomBar>
				<FontAwesomeIcon icon={faArrowLeft} />
				<SaveButton type="submit" form={formID}>Save</SaveButton>
				<FontAwesomeIcon icon={faEllipsisH} />
			</BottomBar>
		</CHBBlurredBG>
	);
};

export default DataEntryRenderer;
