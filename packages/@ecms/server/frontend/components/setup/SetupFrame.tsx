import React, { FunctionComponent } from "react";
import { Dropdown } from "react-bootstrap";
import { faArrowLeft, faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CHBBlurredBG from "../common/AcrylicBackground";
import FlexBox from "../common/FlexBox";
import Button from "../common/Button";
import { Link, useHistory } from "react-router-dom";

/**
 * Custom button for out of frame buttons, usually for navigation (ellipses to go in the bottom right of setup)
 */
// eslint-disable-next-line react/display-name,react/prop-types
const SetupNavButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(({ onClick, children, className }, ref) => (
	<button onClick={onClick} ref={ref} className={className}>
		{children}
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
	/** Show the back button (to go back a page) */
	showBackButton?: boolean;
	/** Custom classNames for the setup frame for custom CSS for different setup screen */
	className?: string;
	/** Custom ID for the setup frame for custom CSS for different setup screen */
	id?: string;
	/** Don't show the next button */
	noNextButton?: boolean;
}
/**
 * Base Setup Components
 * Creates the surface upon which user interative elements for setup are placed
 */
const SetupFrame: FunctionComponent<SetupFrameProps> = ({ showBackButton = true, className = "", id: frameId = "", noNextButton = false, ...props }) => {
	const history = useHistory();
	return ( 
		<CHBBlurredBG>
			<FlexBox className="fill-height-viewport">
				<div className={`setup-frame ${className}`} id={frameId}>

					{props.children}

					<div className="setup-actions">
						{!noNextButton ? <Link to={props.nextPage}>
							<Button className="advance-setup">
								Next
							</Button>
							{/* TODO: Add Skip button */}
						</Link> : null}
					</div>
				</div>

				{/* Bottom, off-frame navigation for back button and context menu */}
				<div className="setup-nav">
					{showBackButton ?
						<SetupNavButton className="setup-back" onClick={() => history.goBack()}>
							<FontAwesomeIcon icon={faArrowLeft} />
						</SetupNavButton>
						: null
					}

					<Dropdown drop="up" className="setup-context-menu">
						<Dropdown.Toggle variant="primary" id="dropdown-basic" as={SetupNavButton}>
							<FontAwesomeIcon icon={faEllipsisH} />
						</Dropdown.Toggle>

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

