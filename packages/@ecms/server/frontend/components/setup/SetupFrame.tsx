import React, { FunctionComponent } from "react";
import { Dropdown } from "react-bootstrap";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CHBBlurredBG from "../common/AcrylicBackground";
import FlexBox from "../common/FlexBox";
import Button, { LinkedButton } from "../common/Button";

/**
 * Custom button for context menu (ellipses to go in the bottom right of setup)
 */
// eslint-disable-next-line react/display-name,react/prop-types
const SetupNavToggle = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(({ onClick }, ref) => (
	<button onClick={onClick} ref={ref}>
		<FontAwesomeIcon icon={faEllipsisH} />
	</button>
));

/**
 * Header for setup - adds the top header to the setup frame.
 * 
 * Use as follows:
 * @example ```tsx
 * <SetupHeader>
 * 	<h1>Large header</h1>
 * 	<h3>Smaller sub-heading to describe what this stage of setup is for</h3>
 * </SetupHeader>
 * ```
 */
export const SetupHeader: React.FC = (props) => {
	return <div className="setup-header">
		{props.children}
	</div>;
};

export interface SetupFrameProps {
	/** The next setup page to navigate to (relative to the /setup route) */
	nextPage: string;
}
/**
 * Base Setup Components
 * Creates the surface upon which user interative elements for setup are placed
 */
const SetupFrame: FunctionComponent<SetupFrameProps> = (props) => {
	return ( 
		<CHBBlurredBG>
			<FlexBox className="fill-height-viewport">
				<div className="setup-frame">
					<SetupHeader>
						<h1>E.g</h1>
						<h2>E.g.</h2>
					</SetupHeader>
					{props.children}
					<div className="setup-actions">
						<LinkedButton className="advance-setup" to={props.nextPage}>
							Next
						</LinkedButton>
					</div>
				</div>

				{/* Context Menu */}
				<div className="setup-nav">
					<Dropdown drop="up">
						<Dropdown.Toggle variant="primary" id="dropdown-basic" as={SetupNavToggle} />

						<Dropdown.Menu variant="dark">
							<Dropdown.Item href="/">Home</Dropdown.Item>
							<Dropdown.Item href="/api/user/logout">Log Out</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</div>
			</FlexBox>
		</CHBBlurredBG>
	);
};
 
export default SetupFrame;

