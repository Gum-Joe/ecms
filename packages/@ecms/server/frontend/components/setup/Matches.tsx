import React, { useCallback } from "react";
import Card from "../common/Card";
import SetupContainer from "./SetupContainer";
import SetupFrame, { SetupHeader } from "./SetupFrame";
import { Dropdown } from "@fluentui/react-northstar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import AddButton from "../common/AddButton";
import { useAppSelector, useAppDispatch } from "../../util/hooks";
import Actions, { setupAction } from "../../actions/setup";
import updateSetup from "../../actions/setup/updateSetup";


/**
 * Used to set matches for a team
 * 
 * Requires `enable_teams` to be true and the data collected for an event to be set to matches.
 */
const Matches: React.FC = (props) => {

	const matches = useAppSelector(state => state.setup.matches) || [];
	const teams = useAppSelector(state => state.setup.teams) || [];

	

	const dispatch = useAppDispatch();

	const addMatch = useCallback(() => {
		dispatch(setupAction(Actions.ADD_MATCH, null));
	}, [dispatch]);

	const handleMatchSelection = (matchIndex, matchPart) => (item: string) => {
		// Map teams to indicies
		const teamsMap = new Map(teams.map((team, index) => [team.name, index]));
		// Find team selected
		const teamIndex = teamsMap.get(item) as number;
		dispatch(setupAction(Actions.UPDATE_MATCH, {
			id: matchIndex,
			setMatchPart: matchPart,
			team: teamIndex,
		}));
		
	};

	const deleteMatch = useCallback((matchIndex) => () => {
		dispatch(setupAction(Actions.DELETE_MATCH, matchIndex));
	}, [dispatch]);

	return (
		<SetupFrame nextPage="/">
			<SetupHeader>
				<h1>Set Matches</h1>
				<h3>Setup matches between teams here</h3>
			</SetupHeader>
			<SetupContainer className="setup-matches-container">
				{
					matches.map((match, index) => 
						<Card key={index}>
							<div className="match-container">
								<Dropdown
									items={teams.map((team) => team.name)}
									placeholder={match.team_1 === -1 ? "Select a Team" : (teams[match.team_1]?.name || "NO TEAM NAME FOUND")}
									required={true}
									className="setup-match-0"
									getA11ySelectionMessage={{
										onAdd: handleMatchSelection(index, 0)
									}}
									fluid
									
								/>
								<p className="matches-vs">vs</p>
								<Dropdown
									items={teams.map((team) => team.name)}
									placeholder={match.team_2 === -1 ? "Select a Team" : (teams[match.team_2]?.name || "NO TEAM NAME FOUND")}
									required={true}
									className="setup-match-1"
									getA11ySelectionMessage={{
										onAdd: handleMatchSelection(index, 1)
									}}
									fluid
								/>
								<p className="delete-match"><FontAwesomeIcon icon={faTrash} onClick={deleteMatch(index)} /></p>
							</div>
						</Card>
					)
				}

				<AddButton onClick={addMatch}>
					Add Match
				</AddButton>
			</SetupContainer>
		</SetupFrame>
	);
};

export default Matches;