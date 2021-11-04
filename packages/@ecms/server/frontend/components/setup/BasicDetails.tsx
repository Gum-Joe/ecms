import React, { FunctionComponent, useContext } from "react";
import { Dropdown } from '@fluentui/react-northstar';
import SetupFrame, { SetupHeader } from "./SetupFrame";
import Form from "../common/Form";
import { useAppSelector } from "../../util/hooks";
import { FluentCheckbox } from "../fluent";

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

const BasicDetails: FunctionComponent<BasicDetailsProps> = () => {
	// Grab our Setup Context
	const setupType = useAppSelector(state => state.setup.type);
	
	return ( 
		<SetupFrame nextPage="/teams" id="setup-basic-details">
			<SetupHeader>
				<h1>{`${(setupType || "UNKNOWN")[0]?.toUpperCase()}${setupType?.slice(1)}`} Setup</h1>
				<h3>Let’s get started - some basic details first</h3>
			</SetupHeader>
			<div className="setup-form-container">
				<h2>Basic Details</h2>
				<Form>
					<div>
						<label htmlFor="name">Name</label>
						<input autoComplete="off" required={true} name="name" id="basic-name" type="text" placeholder="" />
					</div>
					<div>
						<label htmlFor="name">Description</label>
						<input autoComplete="off" required={true} name="name" id="basic-name" type="text" placeholder="" />
					</div>
				</Form>

				<h2>Data Settings</h2>
				<Form>
					<div>
						<FluentCheckbox name="enableTeams">Enable Teams <p className="secondary-input">- specify teams competing</p></FluentCheckbox>
						<FluentCheckbox name="enableCharity">Enable Charity features <p className="secondary-input">- bring data in from different sources, etc</p></FluentCheckbox>
						<FluentCheckbox name="enableInherit">Inherit teams &amp; competitors from parent group <p className="secondary-input">- set teams &amp; competitiors from the group this event is in</p></FluentCheckbox>
					</div>
					<div>
						<label htmlFor="dataToTrack">Data to track</label>
						<Dropdown
							items={dataToTrack}
							placeholder="Select data to track"
							name="dataToTrack"
						/>
					</div>
				</Form>
			</div>
		</SetupFrame>
	);
};
 
export default BasicDetails; 


