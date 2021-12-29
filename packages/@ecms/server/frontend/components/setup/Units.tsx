import React from "react";
import { Dropdown } from "@fluentui/react-northstar";
import SetupContainer from "./SetupContainer";
import SetupFrame, { SetupHeader } from "./SetupFrame";
import SetupForm from "./SetupForm";

const SETUP_UNITS_FORM = "setup-units-form";

const Units: React.FC = (props) => {
	return (
		<SetupFrame nextPage="/end" id="setup-units" formID={SETUP_UNITS_FORM}>
			<SetupHeader>
				<h1>Data Collected</h1>
				<h3>What data are we storing?</h3>
			</SetupHeader>
			<SetupContainer>
				<SetupForm id={SETUP_UNITS_FORM}>
					<div>
						<label htmlFor="name">Name</label>
						<input autoComplete="off" required={true} name="name" id="unit-name" type="text" placeholder="" />
					</div>
					<div>
						<label htmlFor="name">Unit</label>
						<Dropdown
							items={[
								"m",
								"mm:ss",
								"s",
								"Custom",
							]}
							placeholder={"Select one"}
							name="unitDropdown"
							required={true}
							id="unit-dropdown"
						/>
					</div>
					<div>
						<label htmlFor="places">Decimal Places</label>
						<input autoComplete="off" required={true} name="places" id="basic-places" min="0" type="number" placeholder="" value="1" />
					</div>
					<div className="unit-example">
						<label htmlFor="name">Example</label>
						<p>12.3ft</p>
					</div>
				</SetupForm>
			</SetupContainer>
		</SetupFrame>
	);
};

export default Units;