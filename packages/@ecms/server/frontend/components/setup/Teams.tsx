/**
 * Setup Page for Teams
 */

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { ButtonIconContainer, ButtonWithIcons } from "../common/Button";
import Card from "../common/Card";
import SetupFrame, { SetupHeader } from "./SetupFrame";

const SETUP_TEAMS_FORM = "setup-teams-form";
const Teams: React.FC = () => {
	return (
		<SetupFrame nextPage="/matches" id="setup-teams" formID={SETUP_TEAMS_FORM}>
			<SetupHeader>
				<h1>Set Teams</h1>
				<h3>Setup your teams here</h3>

				<div className="teams-setup-container">
					<Card>
						<div className="colour-container">
							<p>Colour</p>
							<div className="colour-square"></div>
						</div>
						<div className="form-container">
							<label htmlFor="team-1">Name</label>
							<input type="text" name="team-1" placeholder="Team Name" />
						</div>
					</Card>
					
					<ButtonWithIcons buttonType="primary">
						<ButtonIconContainer>
							<FontAwesomeIcon icon={faPlus} />
						</ButtonIconContainer>

							Add Team
					</ButtonWithIcons>
				</div>

				
			</SetupHeader>
		</SetupFrame>
	);
};

export default Teams;