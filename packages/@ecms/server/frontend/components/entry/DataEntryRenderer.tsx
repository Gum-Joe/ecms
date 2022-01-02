/**
 * Renders the appropriate data entry component for the given event type
 */
import { event_only_settings, matches, teams } from "@ecms/models";
import { faArrowLeft, faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CHBBlurredBG from "../common/AcrylicBackground";
import BottomBar from "./BottomBar";
import SaveButton from "./SaveButton";

const DataEntryBase: React.FC<{ className: string, name: string }> = (props) => {
	return (
		<div className={`entry-renderer ${props.className}`}>
			<h1 className="sub-header">{props.name}</h1>
			{props.children}
		</div>
	);
};

const MatchEntry: React.FC<{ eventId: string }> = (props) => {

	// Retrieve matches & teams lists
	const [teams, setteams] = useState<teams[]>();
	const [matches, setmatches] = useState<matches[]>();

	useEffect(() => {
		// Code from Co-pilot
		fetch(`/api/events/${props.eventId}/matches`)
			.then(response => response.json())
			.then(data => setmatches(data))
			.catch((err) => {
				console.error(err);
			});
		fetch(`/api/common/${props.eventId}/teams`)
			.then(response => response.json())
			.then(data => setteams(data))
			.catch((err) => {
				console.error(err);
			});
	}, [props.eventId]);

	return (
		<DataEntryBase className="entry-matches" name="Match Entry">
			<div className="entry-matches-container">
				{
					matches?.map((match, index) => {
						const team1Info = teams?.find(team => team.team_id === match.team_1);
						const team2Info = teams?.find(team => team.team_id === match.team_2);
						return (
							<div key={index} className="matches-item">
								<div className="matches-header">
									<p className="team-name" style={{ backgroundColor: team1Info?.colour }}>{team1Info?.name}</p>
									<p className="team-name" style={{ backgroundColor: team2Info?.colour }}>{team2Info?.name}</p>
									<div className="team-vs"><p>vs</p></div>
								</div>
								<div className="matches-inputs">
									<div className="match-input-container"><input type="number" placeholder="1" className="match-team-1" /></div>
									<p>-</p>
									<div className="match-input-container"><input type="number" placeholder="1" className="match-team-2" /></div>	
								</div>
							</div>
						)}
					)
				}
				
				
			</div>
		</DataEntryBase>
	);
};

const DataEntryRenderer: React.FC = (props) => {

	const [eventInfo, seteventInfo] = useState<event_only_settings>();
	const { id } = useParams<{ id: string }>();
	// Retrieve the event info
	useEffect(() => {
		fetch(`/api/events/${id}/info`)
			.then(response => response.json())
			.then(data => seteventInfo(data))
			.catch((err) => {
				console.error(err);
			});
	}, [id]);

	const getEntryPage = useCallback(
		() => {
			switch (eventInfo?.data_tracked) {
				case "matches":
					return <MatchEntry eventId={id} />;
				default:
					return <div className={"entry-renderer"}>
						<h1 className="sub-header">Loading...</h1>
					</div>;
			}
		},
		[eventInfo],
	);
	return (
		<CHBBlurredBG className="entry-page">
			{
				getEntryPage()
			}
			<BottomBar>
				<FontAwesomeIcon icon={faArrowLeft} />
				<SaveButton>Save</SaveButton>
				<FontAwesomeIcon icon={faEllipsisH} />
			</BottomBar>
		</CHBBlurredBG>
	);
};

export default DataEntryRenderer;
