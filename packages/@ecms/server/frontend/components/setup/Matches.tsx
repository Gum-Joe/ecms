import React from "react";
import Card from "../common/Card";
import SetupContainer from "./SetupContainer";
import SetupFrame, { SetupHeader } from "./SetupFrame";
import { Dropdown } from "@fluentui/react-northstar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import AddButton from "../common/AddButton";


/**
 * Used to set matches for a team
 * 
 * Requires `enable_teams` to be true and the data collected for an event to be set to matches.
 */
const Matches: React.FC = (props) => {
	return (
		<SetupFrame nextPage="/">
			<SetupHeader>
				<h1>Set Matches</h1>
				<h3>Setup matches between teams here</h3>
			</SetupHeader>
			<SetupContainer className="setup-matches-container">
				<Card>
					<div className="match-container">
						<Dropdown
							items={["Tudor"]}
							placeholder={"Select a Team"}
							name="team-0-0"
							required={true}
							className="setup-match-0"
						/>
						<p className="matches-vs">vs</p>
						<Dropdown
							items={["Tudor"]}
							placeholder={"Select a Team"}
							name="team-0-0"
							required={true}
							className="setup-match-1"
						/>
						<p className="delete-match"><FontAwesomeIcon icon={faTrash} /></p>
					</div>
				</Card>

				<AddButton>
					Add Match
				</AddButton>
			</SetupContainer>
		</SetupFrame>
	);
};

export default Matches;