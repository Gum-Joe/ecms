import { PointsSystems, PointsSystemsDisplay, PointsSystemSpec } from "@ecms/api/points";
import { events_and_groups, event_only_settings } from "@ecms/models";
import { Dropdown } from "@fluentui/react-northstar";
import React, { useEffect, useState } from "react";
import SetupActionsList, { setupAction } from "../../../actions/setup";
import { SetupState } from "../../../constants/interfaces";
import { useAppDispatch, useAppSelector } from "../../../util/hooks";
import SetupContainer from "../SetupContainer";
import SetupFrame, { SetupHeader } from "../SetupFrame";
import PointsSettings from "./PointsSettings";

/**
 * Root setup frame to hold points systems
 */
const PointsRoot: React.FC = (props) => {
	// Store a list of valid points systems
	const [validSystems, setvalidSystems] = useState<PointsSystemSpec[]>([]);
	const setup = useAppSelector(state => state.setup);
	const dispatch = useAppDispatch();

	useEffect(() => {
		// Apply masks
		setvalidSystems(PointsSystemsDisplay.filter(system => {
			// Validate
			for (const key in system.validOn.event_group_settings) {
				if (Object.prototype.hasOwnProperty.call(system.validOn.event_group_settings, key)) {
					if (system.validOn.event_group_settings[(key as keyof events_and_groups)] !== setup[key as keyof SetupState]) {
						return false;
					}
				}
			}
			if (system.validOn.event_only_settings && setup.event_settings) {
				for (const key in system.validOn.event_only_settings) {
					if (Object.prototype.hasOwnProperty.call(system.validOn.event_only_settings, key)) {
						if (system.validOn.event_only_settings[(key as keyof event_only_settings)] !== setup.event_settings[key as keyof SetupState["event_settings"]]) {
							return false;
						}
					}
				}
			}

			return true;
		}));
	}, [setup]);
	return (
		<SetupFrame nextPage="/end" id="set-points">
			<SetupHeader>
				<h1>Set Points System</h1>
				<h3>How do you want to score this event/group?</h3>
			</SetupHeader>
			<SetupContainer id="setup-end">
				<div className="system-picker">
					<h3>Select a scoring system</h3>
					<div className="scoring-system-container">
						<Dropdown
							items={validSystems.map(system => system.displayName)}
							placeholder="Select a scoring system"
							name="scoring-system"
							required={true}
							getA11ySelectionMessage={{
								onAdd: (item: string) => {
									const system = validSystems.find(system => system.displayName === item);
									if (typeof system === "undefined") {
										console.debug(`System ${item} not found.`);
										return;
									}
									dispatch(setupAction(SetupActionsList.SET_POINTS_SYSTEM, system.name));
								}
							}}
						/>
						<p>Description</p>
					</div>
				</div>
				<div className="system-settings">
					<h3>Settings</h3>
					<PointsSettings system={setup.points?.module_id} />
				</div>
				<footer>
					<p>NB: We also automatically track the running total of points for each team accross all sub-events</p>
				</footer>
			</SetupContainer>
		</SetupFrame>
	);
};

export default PointsRoot;