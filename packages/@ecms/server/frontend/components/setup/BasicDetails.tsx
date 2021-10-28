import React, { FunctionComponent } from "react";
import SetupFrame, { SetupHeader } from "./SetupFrame";
import Form from "../common/Form";

/**
 * The first page of setup: basic details about it
 */
interface BasicDetailsProps {
	a?: string;
}
 
const BasicDetails: FunctionComponent<BasicDetailsProps> = () => {
	return ( 
		<SetupFrame nextPage="/teams" id="setup-basic-details">
			<SetupHeader>
				<h1>Event/Group Setup</h1>
				<h3>Let’s get started - some basic details first</h3>
			</SetupHeader>

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
		</SetupFrame>
	);
};
 
export default BasicDetails;