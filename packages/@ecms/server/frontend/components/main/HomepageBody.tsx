import { faCalendarAlt, faObjectGroup, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link, useParams, useRouteMatch } from "react-router-dom";
import { ButtonIconContainer, ButtonRow, ButtonWithIcons } from "../common/Button";

/**
 * The actual body of the homepage with the event/group specific content
 */
export const HomepageBody: React.FC = (props) => {

	const { id: rawEventGroupID } = useParams<{
		id?: string | "root";
	}>();

	const eventGroupID = (!rawEventGroupID || rawEventGroupID === "root") ? undefined : rawEventGroupID;
	const { path, url } = useRouteMatch();

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
