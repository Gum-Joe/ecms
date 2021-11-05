import React, { FunctionComponent } from "react";
import { Dropdown } from "@fluentui/react-northstar";
import SetupFrame, { SetupHeader } from "./SetupFrame";
import { useAppDispatch, useAppSelector } from "../../util/hooks";
import { FluentCheckbox } from "../fluent";
import SetupForm from "./SetupForm";
import updateSetup from "../../actions/setup/updateSetup";
import { useSetupRedirector } from "./util";

/**
 * The first page of setup: basic details about it
 */
interface BasicDetailsProps {
	a?: string;
}

/**
 * Options for data to track
 */
const dataToTrack = [
	"Matches between teams",
	"Individual performance (including within teams)",
	"Points teams get",
	"None (e.g. charity event)"
];

const SETUP_BASIC_DETAILS_FORM = "setup-basic-details-form";
const BasicDetails: FunctionComponent<BasicDetailsProps> = () => {
	// Grab our Setup Context
	const setupType = useAppSelector(state => state.setup.type);
	const parent_id = useAppSelector(state => state.setup.parent_id);
	const dispatch = useAppDispatch();

	const setupPage = useSetupRedirector();

	const onSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
		event.preventDefault();

		const data = new FormData(event.target as HTMLFormElement);
		const formObject: Record<string, string> = Object.fromEntries(data.entries()) as Record<string, string>;
		console.log(formObject);
		dispatch(updateSetup({
			name: formObject.name,
			description: formObject.description,
			enable_teams: formObject.enableTeams === "on" ? true : false,
			enable_charity: formObject.enableCharity === "on" ? true : false,
			inheritance: formObject.enableInherit === "on" ? true : false,
		}));
		
		setupPage("/teams");
		
	};
	
	return ( 
		<SetupFrame nextPage="/teams" id="setup-basic-details" formID={SETUP_BASIC_DETAILS_FORM}>
			<SetupHeader>
				<h1>{`${(setupType || "UNKNOWN")[0]?.toUpperCase()}${setupType?.slice(1)}`} Setup</h1>
				<h3>Let’s get started - some basic details first</h3>
			</SetupHeader>
			<div className="setup-form-container">
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
							<FluentCheckbox name="enableTeams" defaultChecked>Enable Teams <p className="secondary-input">- specify teams competing</p></FluentCheckbox>
							<FluentCheckbox name="enableCharity">Enable Charity features <p className="secondary-input">- bring data in from different sources, etc</p></FluentCheckbox>
							<FluentCheckbox disabled={!parent_id ? true : false} name="enableInherit">Inherit teams &amp; competitors from parent group <p className="secondary-input">- set teams &amp; competitiors from the group this event is in</p></FluentCheckbox>
						</div>
						<div>
							<label htmlFor="dataToTrack">Data to track</label>
							<Dropdown
								items={dataToTrack}
								placeholder="Select data to track"
								name="dataToTrack"
								required={true}
							/>
						</div>
					</section>
				</SetupForm>
			</div>
		</SetupFrame>
	);
};
 
export default BasicDetails; 


