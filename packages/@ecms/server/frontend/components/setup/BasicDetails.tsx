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
import setupInitalRedirect from "./redirector";
import SetupActionsList, { setupAction } from "../../actions/setup";


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
		const setupObject = {
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
		};
		dispatch(updateSetup(setupObject)).then(() => {
			// 0: If inheritance set, need to redirect so we can set things in state we need from inheritance
			if (setupObject.inheritance) {
				return setupPage("/inherit");
			}
		
			return setupInitalRedirect(setupObject, setupPage, setupType);		
		});
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





