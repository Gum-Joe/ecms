import React, { useCallback, useState } from "react";
import { Dropdown } from "@fluentui/react-northstar";
import SetupContainer from "./SetupContainer";
import SetupFrame, { SetupHeader } from "./SetupFrame";
import SetupForm from "./SetupForm";
import { useAppDispatch } from "../../util/hooks";
import Actions, { setupAction } from "../../actions/setup";
import { useSetupRedirector } from "./util";

const SETUP_UNITS_FORM = "setup-units-form";

type UnitState = { 
	unit: "none" | "m" | "mm:ss" | "s" | "Custom"
}

const longExampleUnit = 12.34567890101112;

function computeExample(decimalPlaces: number, currrentUnit: UnitState, customUnit: string) {
	if (currrentUnit.unit === "mm:ss") {
		return `12m ${34.567890.toFixed(decimalPlaces)}s`;
	} else if (currrentUnit.unit === "Custom") {
		return longExampleUnit.toFixed(decimalPlaces) + customUnit;
	} else  {
		return longExampleUnit.toFixed(decimalPlaces) + currrentUnit.unit;
	}
}

const Units: React.FC = (props) => {

	const [showCustomUnitBox, setshowCustomUnitBox] = useState(false);
	const [currrentUnit, setcurrrentUnit] = useState<UnitState>({
		unit: "none"
	});
	const [decimalPlaces, setdecimalPlaces] = useState(1);
	const [theCustomUnit, setsaveCustomUnit] = useState("");

	const dispatch = useAppDispatch();
	const setupPage = useSetupRedirector();

	/** Handle submit */
	const onSubmit: React.FormEventHandler<HTMLFormElement> = useCallback((event) => {
		event.preventDefault();
		const data = new FormData(event.target as HTMLFormElement);
		const formObject: Record<string, string> = Object.fromEntries(data.entries()) as Record<string, string>;

		if (currrentUnit.unit === "none") {
			return alert("Please select a unit first using the dropdown");
		}

		if (currrentUnit.unit === "Custom") {
			dispatch(setupAction(Actions.SET_DATA_UNIT, {
				unit_name: formObject.name,
				unit: theCustomUnit,
				decimal_places: decimalPlaces
			}));
		} else {
			dispatch(setupAction(Actions.SET_DATA_UNIT, {
				unit_name: formObject.name,
				unit: currrentUnit.unit,
				decimal_places: decimalPlaces
			}));
		}

		setupPage("/points");
		

	}, [currrentUnit.unit, decimalPlaces, dispatch, setupPage, theCustomUnit]);

	return (
		<SetupFrame nextPage="/end" id="setup-units" formID={SETUP_UNITS_FORM}>
			<SetupHeader>
				<h1>Data Collected</h1>
				<h3>What data are we storing?</h3>
			</SetupHeader>
			<SetupContainer>
				<SetupForm id={SETUP_UNITS_FORM} onSubmit={onSubmit}>
					<section>
						<div>
							<label htmlFor="name">Name</label>
							<input autoComplete="off" required={true} name="name" id="unit-name" type="text" placeholder="" />
						</div>
						<div className="unit-section">
							<label htmlFor="name">Unit</label>
							<div className="unit-setter">
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
									getA11ySelectionMessage={{
										onAdd: (item: string) => {
											if (item === "Custom") {
												setshowCustomUnitBox(true);
												setcurrrentUnit({
													unit: "Custom",
												});
											} else {
												setshowCustomUnitBox(false);
												setcurrrentUnit({
													unit: item,
												});
											}
										}
									}}
								/>
								<input autoComplete="off" name="unit-custom" id="unit-custom" type="text" placeholder="Enter custom unit here" disabled={!showCustomUnitBox} onChange={(event) => setsaveCustomUnit(event.target.value)} style={{
									opacity: showCustomUnitBox ? 1 : 0
								}} />
							</div>
							
						</div>
						<div>
							<label htmlFor="places">Decimal Places</label>
							<input
								autoComplete="off"
								required={true}
								defaultValue={1}
								name="places"
								id="basic-places"
								min={0}
								max={20}
								type="number"
								placeholder=""
								onChange={(event) => {
									const parsedValue = parseInt(event.target.value, 10) || 0; 
									if (parsedValue >= 0 && parsedValue <= 20) {
										setdecimalPlaces(parsedValue);
									} else {
										alert("Please enter a value between 0 and 20");
									}
									
								}}
							/>
						</div>
						<div className="unit-example">
							<label htmlFor="name">Example</label>
							<p>{currrentUnit.unit !== "none" ? ( computeExample(decimalPlaces, currrentUnit, theCustomUnit) ) : "Please select a unit first."}</p>
						</div>
					</section>
					
				</SetupForm>
			</SetupContainer>
		</SetupFrame>
	);
};

export default Units;