import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FunctionComponent } from "react";
import { Dropdown } from "react-bootstrap";
import CHBBlurredBG from "../common/AcrylicBackground";
import FlexBox from "../common/FlexBox";

/**
 * Custom button for context menu
 */
// eslint-disable-next-line react/display-name,react/prop-types
const SetupNavToggle = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(({ onClick }, ref) => (
	<button onClick={onClick} ref={ref}>
		<FontAwesomeIcon icon={faEllipsisH} />
	</button>
));

/**
 * Base Setup Components
 * Creates the surface upon which the Setup Forms are placed
 */
const SetupFrame: FunctionComponent = (props) => {
	return ( 
		<CHBBlurredBG>
			<FlexBox className="fill-height-viewport">
				<div className="setup-frame">
					{props.children}
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