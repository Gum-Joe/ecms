/**
 * Setup Page for Teams
 */

import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useState } from "react";
import { SketchPicker } from "react-color";
import { HOUSE_BEAUFORT, HOUSE_HOWARD, HOUSE_SEYMOUR, HOUSE_TUDOR } from "@ecms/core/lib/colours";
import Button, { ButtonIconContainer, ButtonWithIcons } from "../common/Button";
import Card from "../common/Card";
import SetupFrame, { SetupHeader } from "./SetupFrame";
import { ColorPicker } from "@fluentui/react/lib/ColorPicker";
import type { IColor } from "@fluentui/react";
import { useAppDispatch, useAppSelector } from "../../util/hooks";
import { setupAction } from "../../actions/setup";
import { StagingTeam, useSetupRedirector } from "./util";
import Actions from "../../actions/setup";
import updateSetup from "../../actions/setup/updateSetup";
import SetupContainer from "./SetupContainer";

const SETUP_TEAMS_FORM = "setup-teams-form";


// TODO: Load Teams in
const Teams: React.FC = () => {

	// Temporary store for teams
	const teamsFromState = useAppSelector(state => state.setup.teams);
	const eventGroupType = useAppSelector(state => state.setup.type);
	const eventSettings = useAppSelector(state => state.setup.event_settings);
	// (you need to attach the names manually as this is done onSubmit)
	const [teams, setteams] = useState<StagingTeam[]>(teamsFromState as StagingTeam[] || []);

	const handleColSqaureClick = useCallback((index: number) => () => {
		setteams((currentTeams) => {
			const newTeams = [...currentTeams];
			newTeams[index].showPicker = true;
			return newTeams;
		});
	}, []);

	const handleEndColSelection = useCallback((index: number) => () => {
		setteams((currentTeams) => {
			const newTeams = [...currentTeams];
			newTeams[index].showPicker = false;
			return newTeams;
		});
	}, []);

	// Written by GitHub Copilot
	const handlePickerChange = useCallback((index: number) => (event: any, colorObj: IColor) => {
		setteams((currentTeams) => {
			const newTeams = [...currentTeams];
			newTeams[index].colour = "#" + colorObj.hex;
			return newTeams;
		});
	}, []);

	const addTeam = useCallback(() => {
		setteams((currentTeams) => {
			return [
				...currentTeams,
				({
					name: "",
					// From https://css-tricks.com/snippets/javascript/random-hex-color/
					// Randomly generate a colour
					colour: "#" + Math.floor(Math.random() * 16777215).toString(16),
				} as StagingTeam)
			];
		});
	}, []);

	const removeTeam = useCallback((index: number) => () => {
		setteams((currentTeams) => {
			const newTeams = [...currentTeams.filter((value, i) => i !== index)];
			return newTeams;
		});
	}, []);

	const dispatch = useAppDispatch();
	const setupPage = useSetupRedirector();

	/** Copy teams to the store on clicking "Next" */
	const advanceSetup = useCallback((event) => {
		event.preventDefault();
		const teamsToSend = [...teams];

		// Grab Team imputs from the inputs boxes for each.
		const data = new FormData(event.target as HTMLFormElement);
		const formObject: Record<string, string> = Object.fromEntries(data.entries()) as Record<string, string>;

		// Set correspondiong tags - use the `name` attribute of the inputs to find the correct team name and insert them into the `teamsToSend` array
		for (const teamInput in formObject) {
			if (Object.prototype.hasOwnProperty.call(formObject, teamInput)) {
				if (teamInput.startsWith("team-")) {
					const index = parseInt(teamInput.split("-")[1]);
					if (isNaN(index)) {
						console.error(`Error getting team index from ${teamInput}`);
					} else {
						teamsToSend[index].name = formObject[teamInput];
					}
				}
				
			}
		}

		// Update global store
		dispatch(updateSetup({
			teams: teamsToSend,
		}));

		// Redirect to next page
		if (eventGroupType === "event") {
			if (eventSettings?.data_tracked === "matches") {
				setupPage("/matches");
			} else if (eventSettings?.data_tracked === "individual") {
				setupPage("/competitors");
			} else {
				setupPage("/end");
			}
			return;
		} else {
			// Group
			setupPage("/competitors");
			return;
		}
		
	} , [dispatch, teams, setupPage]);

	return (
		<SetupFrame id="setup-teams" formID={SETUP_TEAMS_FORM}>
			<SetupHeader>
				<h1>Set Teams</h1>
				<h3>Setup your teams here</h3>
			</SetupHeader>

			<SetupContainer as={"form"} id={SETUP_TEAMS_FORM} onSubmit={advanceSetup} className="teams-setup-container">
				{
					teams.map((team, index) =>
						<Card key={index}>
							<div className="colour-container">
								<p>Colour</p>
								{
									!team.showPicker ?
										<div onClick={handleColSqaureClick(index)} className="colour-square" style={{ backgroundColor: team.colour }}>

										</div>
										:
									/* FROM https://developer.microsoft.com/en-us/fluentui#/controls/web/colorpicker */
										<>
											<ColorPicker
												color={team.colour}
												onChange={handlePickerChange(index)}
												alphaType={"none"}
												showPreview={true}
												//styles={colorPickerStyles}
												// The ColorPicker provides default English strings for visible text.
												// If your app is localized, you MUST provide the `strings` prop with localized strings.
												strings={{
													// By default, the sliders will use the text field labels as their aria labels.
													// Previously this example had more detailed instructions in the labels, but this is
													// a bad practice and not recommended. Labels should be concise, and match visible text when possible.
													hueAriaLabel: "Hue",
												}} />
											<Button onClick={handleEndColSelection(index)}>Done</Button>
										</>
								}
									

							</div>
							<div className="form-container">
								<label htmlFor="team-1">Name</label>
								<input type="text" name={`team-${index}`} placeholder="Team Name" required value={team.name || undefined} />
							</div>

							<Button buttonType="primary" onClick={removeTeam(index)}>
								<FontAwesomeIcon icon={faTrash} />
							</Button>
						</Card>
					)
				}
					
					
				<ButtonWithIcons buttonType="primary" onClick={addTeam}>
					<ButtonIconContainer>
						<FontAwesomeIcon icon={faPlus} />
					</ButtonIconContainer>

							Add Team
				</ButtonWithIcons>
			</SetupContainer>
		</SetupFrame>
	);
};

export default Teams;