import { matches, teams } from "@ecms/models";
import { faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { DataEntryBase } from "./DataEntryBase";
import EntryCard from "./EntryCard";
import { EntryComponentProps } from "./interfaces";
import { fetchTeams } from "./util";

/**
 * We add these props to the matches state to mark those in need of update
 */
interface AdditionalMatchProps {
	didUpdate?: boolean;
}
interface MatchUpdateState {
	didUpdate: boolean;
	state: null | "success" | "error";
	message?: string;
}
export const MatchEntry: React.FC<EntryComponentProps> = (props) => {

	// Retrieve matches & teams lists
	const [teams, setteams] = useState<teams[]>();
	const [matches, setmatches] = useState<(matches & AdditionalMatchProps)[]>();
	const [updatingState, setupdatingState] = useState<MatchUpdateState>({
		didUpdate: false,
		state: null
	});

	useEffect(() => {
		// Code from Co-pilot
		fetch(`/api/events/${props.eventId}/matches`)
			.then(response => response.json())
			.then(data => setmatches(data))
			.catch((err) => {
				console.error(err);
			});
		fetchTeams(props.eventId, setteams);
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

		axios.patch(`/api/events/${props.eventId}/matches/edit/score`, dataToSubmit)
			.then(response => {
				(document.querySelector(".entry-renderer") || ({} as any)).scrollTop = 0;
				console.log("Matches updated.");
				setupdatingState({
					didUpdate: true,
					state: "success"
				});
			})
			.catch((err) => {
				(document.querySelector(".entry-renderer") || ({} as any)).scrollTop = 0;
				console.error(err);
				setupdatingState({
					didUpdate: true,
					state: "error",
					message: err.message || "An unknown error occurred",
				});
			});
	}, [matches, props.eventId]);

	return (
		<DataEntryBase className="entry-matches" name="Match Entry">
			{updatingState.didUpdate &&
				<div className={"update-banner " + (updatingState.state === "error" ? "update-banner-error" : "update-banner-sucess")}>
					{updatingState.state === "error" ? (
						<><FontAwesomeIcon icon={faTimesCircle} /> Error updating matches: {updatingState.message}</>
					) :
						(
							<><FontAwesomeIcon icon={faCheckCircle} /> Matches updated successfully</>
						)}
				</div>}
			<form className="entry-matches-container" onSubmit={handleSubmit} id={props.formID}>
				{matches?.map((match, index) => {
					const team1Info = teams?.find(team => team.team_id === match.team_1);
					const team2Info = teams?.find(team => team.team_id === match.team_2);
					return (
						<EntryCard key={index} className="matches-item">
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
						</EntryCard>
					);
				})}


			</form>
		</DataEntryBase>
	);
};
