import { faCalendarAlt, faObjectGroup, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ButtonIconContainer, ButtonRow, ButtonWithIcons } from "../common/Button";
import HomepageEventGroupID from "./context/HomepageEventGroupID";

/**
 * The actual body of the homepage with the event/group specific content
 */
export const HomepageBody: React.FC = (props) => {

	const eventGroupID = useContext(HomepageEventGroupID);

	return (
		<>
			{!eventGroupID ?
				<div className="homepage-header">
					<h1 className="sub-header">Homepage</h1>
					<h3 className="header-3">Use the sidebar to the left to quickly jump to an event</h3>
				</div>
				:
				<div className="homepage-header">
					<h1 className="sub-header">Event {eventGroupID}</h1>
					<h3 className="header-3">Use the sidebar to the left to quickly jump to an event</h3>
				</div>}

			<ButtonRow>
				<Link to={`/setup?type=event&parentId=${eventGroupID}`}>
					<ButtonWithIcons buttonType="primary">
						<ButtonIconContainer>
							<FontAwesomeIcon icon={faPlus} />
							<FontAwesomeIcon icon={faCalendarAlt} />
						</ButtonIconContainer>
						Add event
					</ButtonWithIcons>
				</Link>

				<Link to={`/setup?type=group&parentId=${eventGroupID}`}>
					<ButtonWithIcons buttonType="primary">
						<ButtonIconContainer>
							<FontAwesomeIcon icon={faPlus} />
							<FontAwesomeIcon icon={faObjectGroup} />
						</ButtonIconContainer>
						Add group
					</ButtonWithIcons>
				</Link>
			</ButtonRow>
		</>
	);
};
