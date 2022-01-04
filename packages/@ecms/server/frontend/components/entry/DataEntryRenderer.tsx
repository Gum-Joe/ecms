/**
 * Renders the appropriate data entry component for the given event type
 */
import { event_only_settings, matches, teams } from "@ecms/models";
import { faArrowLeft, faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
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

/**
 * We add these props to the matches state to mark those in need of update
 */
interface AdditionalMatchProps {
	didUpdate?: boolean;
}

const MatchEntry: React.FC<{ eventId: string, formID: string }> = (props) => {

	// Retrieve matches & teams lists
	const [teams, setteams] = useState<teams[]>();
	const [matches, setmatches] = useState<(matches & AdditionalMatchProps)[]>(); 	

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

	const updateMatch = useCallback((matchIndex: number, teamIndex: 1 | 2) => {
		return (event: ChangeEvent<HTMLInputElement>) => {
			const newMatches = [...(matches || [])];
			newMatches[matchIndex].didUpdate = true;
			if (teamIndex === 1) {
				newMatches[matchIndex].team_1_score = parseInt(event.target.value, 10);
			} else if (teamIndex === 2) {
				newMatches[matchIndex].team_2_score = parseInt(event.target.value, 10);
			}
			setmatches(newMatches);
		};
	}, [matches]);
	
	const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback((event) => {
		event.preventDefault();
		console.log("Submitting matches...");
		if (!Array.isArray(matches)) {
			throw new Error("No matches to submit (matches not an array)!");
		}

		const dataToSubmit = matches.filter(match => match.didUpdate);

		axios.post(`/api/events/${props.eventId}/matches/edit/score`, dataToSubmit)
			.then(response => {
				console.log("Matches updated.");
			})
			.catch((err) => {
				console.error(err);
			});
	}, [matches, props.eventId]);

	return (
		<DataEntryBase className="entry-matches" name="Match Entry">
			<form className="entry-matches-container" onSubmit={handleSubmit} id={props.formID}>
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
									<div className="match-input-container"><input type="number" min={0} value={match.team_1_score} className="match-team-1" onChange={updateMatch(index, 1)} /></div>
									<p>-</p>
									<div className="match-input-container"><input type="number" min={0} value={match.team_2_score} className="match-team-2" onChange={updateMatch(index, 2)} /></div>	
								</div>
							</div>
						);
					})
				}
				
				
			</form>
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
		(formID: string) => {
			switch (eventInfo?.data_tracked) {
				case "matches":
					return <MatchEntry eventId={id} formID={formID} />;
				default:
					return <div className={"entry-renderer"}>
						<h1 className="sub-header">Loading...</h1>
					</div>;
			}
		},
		[eventInfo],
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
