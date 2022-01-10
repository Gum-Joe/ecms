import React, { FunctionComponent, useEffect, useState } from "react";
import { Dropdown } from "@fluentui/react-northstar";
import { trackable_data } from "@ecms/models";
import SetupFrame, { SetupHeader } from "./SetupFrame";
import { useAppDispatch, useAppSelector } from "../../util/hooks";
import { FluentCheckbox } from "../fluent";
import SetupForm from "./SetupForm";
import updateSetup from "../../actions/setup/updateSetup";
import { useSetupRedirector, getDataFromDropDown } from "./util";
import SetupContainer from "./SetupContainer";
import { useParams } from "react-router-dom";


/**
 * Options for data to track
 */
const dataToTrack: Map<string, trackable_data> = new Map([
	["Matches between teams", "matches"],
	["Individual performance (including within teams)", "individual"],
	["Points teams get", "points"], // TODO: Map
	["None (e.g. charity event)", "none"],
]);

const SETUP_BASIC_DETAILS_FORM = "setup-basic-details-form";
const SETUP_EVENT_DATA_PLACEHOLDER = "Select data to track";

const BasicDetails: FunctionComponent = () => {
	// Grab our Setup Context
	const setupType = useAppSelector(state => state.setup.type);
	const parent_id = useAppSelector(state => state.setup.parent_id);
	const [doesInherit, setdoesInherit] = useState(false);
	const dispatch = useAppDispatch();

	const setupPage = useSetupRedirector();

	const onSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
		event.preventDefault();

		const data = new FormData(event.target as HTMLFormElement);
		const formObject: Record<string, string> = Object.fromEntries(data.entries()) as Record<string, string>;
		if (getDataFromDropDown("data-settings-dropdown") === SETUP_EVENT_DATA_PLACEHOLDER) {
			// TODO: Use a banner
			return alert("Please select data to track");
		}
		dispatch(updateSetup({
			name: formObject.name,
			description: formObject.description,
			enable_teams: formObject.enableTeams === "on" ? true : false,
			enable_charity: formObject.enableCharity === "on" ? true : false,
			inheritance: formObject.enableInherit === "on" ? true : false,
			event_settings: {
				data_tracked: dataToTrack.get(
					getDataFromDropDown("data-settings-dropdown") || "none",
				) as trackable_data,
			},
		}));


		// Routing time!
		// Decide redirects

		// 1: if teams need to be set, let that occurs (unless inheritance from parent is selected, in which case copy in parent's teams?)
		if (formObject.enableTeams === "on") {
			setupPage("/teams");
			return;
		}
		
		// 2: Check event type info if an event - if the setting of matches is on, go to matches page
		// 2a: if the event type is individual performance, go to competitors
		// 2b: if neither of the above, go to finalising page (no other things to set)
		if (setupType === "event") {
			const dataTracked = dataToTrack.get(
				getDataFromDropDown("data-settings-dropdown") || "none",
			) as trackable_data;
			
			if (dataTracked === "matches") {
				// INVALID STATE - Teams need to be set to use matches!
				alert("Invalid parameters - teams need to be enabled to use matches.");
				return;
			} else if (dataTracked === "individual") {
				setupPage("/competitors");
				return;
			} else {
				setupPage("/end");
				return;
			}
		}

		// 3: Finally, if this is a group or event and there are no teams to add allow competitors to be added 
		setupPage("/competitors");
		
	};
	
	return ( 
		<SetupFrame nextPage="/teams" id="setup-basic-details" formID={SETUP_BASIC_DETAILS_FORM}>
			<SetupHeader>
				<h1>{`${(setupType || "UNKNOWN")[0]?.toUpperCase()}${setupType?.slice(1)}`} Setup</h1>
				<h3>Let’s get started - some basic details first</h3>
			</SetupHeader>
			<SetupContainer>
				<SetupForm onSubmit={onSubmit} id={SETUP_BASIC_DETAILS_FORM}>
					<h2>Basic Details</h2>
					<section>
						<div>
							<label htmlFor="name">Name</label>
							<input autoComplete="off" required={true} name="name" id="basic-name" type="text" placeholder="" />
						</div>
						<div>
							<label htmlFor="name">Description</label>
							<input autoComplete="off" required={true} name="description" id="basic-description" type="text" placeholder="" />
						</div>
					</section>
				
					<h2>Data Settings</h2>
					<section>
						<div>
							<FluentCheckbox disabled={doesInherit} name="enableTeams" defaultChecked>Enable Teams <p className="secondary-input">- specify teams competing</p></FluentCheckbox>
							<FluentCheckbox name="enableCharity">Enable Charity features <p className="secondary-input">- bring data in from different sources, etc</p></FluentCheckbox>
							<FluentCheckbox disabled={!parent_id ? true : false} name="enableInherit" onClick={(event: any) => setdoesInherit(event.target._checked)}>Inherit teams &amp; competitors from parent group <p className="secondary-input">- set teams &amp; competitiors from the group this event is in</p></FluentCheckbox>
						</div>
						{
							setupType === "event" ? // the below is only relevant to events, not groups
								(<div>
									<label htmlFor="dataToTrack">Data to track</label>
									<Dropdown
										items={[...dataToTrack.keys()]}
										placeholder={SETUP_EVENT_DATA_PLACEHOLDER}
										name="dataToTrack"
										required={true}
										id="data-settings-dropdown"
									/>
								</div>)
								:
								null
						}
					</section>
				</SetupForm>
			</SetupContainer>
		</SetupFrame>
	);
};
 
export default BasicDetails; 





