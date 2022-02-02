import { Dropdown } from "@fluentui/react-northstar";
import React from "react";
import SetupContainer from "../SetupContainer";
import SetupFrame, { SetupHeader } from "../SetupFrame";

/**
 * Root setup frame to hold points systems
 */
const PointsRoot: React.FC = (props) => {
	return (
		<SetupFrame nextPage="/end" id="set-points">
			<SetupHeader>
				<h1>Set Points System</h1>
				<h3>How do you want to score this event/group?</h3>
			</SetupHeader>
			<SetupContainer id="setup-end" className="setup-end-container">
				<div className="system-picker">
					<h3>Select a scoring system</h3>
					<div className="scoring-system-container">
						<Dropdown
							items={["hi"]}
							placeholder="Select a scoring system"
							name="scoring-system"
							required={true}
						/>
						<p>Description</p>
					</div>
				</div>
				<div className="system-settings">
					<h3>Settings</h3>
				</div>
				<footer>
					<p>NB: We also automatically track the running total of points for each team accross all sub-events</p>
				</footer>
			</SetupContainer>
		</SetupFrame>
	);
};

export default PointsRoot;