import { faCalendar, faCalendarAlt, faCog, faEdit, faHome, faObjectGroup, faPlus, faTable, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Dropdown, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Button, { ButtonIconContainer, ButtonRow, ButtonWithIcons } from "../common/Button";
/**
 * Homepage of Events Management UI
 */
const HomepageMain: React.FC = (props) => {
	return (
		<div className="main-container">
			<div className="branding">
				<h1 className="title-header">ECMS</h1>

			</div>

			<nav className="main-nav">
				<div className="main-nav-links">
					<Link to="/">
						<FontAwesomeIcon icon={faHome} /> Manage Events
					</Link>

					<Link to="/records">
						<FontAwesomeIcon icon={faTable} /> Manage Records
					</Link>

					<Link to="/admin">
						<FontAwesomeIcon icon={faCog} /> Admin Panel
					</Link>

					<Link to="/entry">
						<FontAwesomeIcon icon={faEdit} /> Data Entry
					</Link>

					<Dropdown>
						<Dropdown.Toggle variant="link" id="dropdown-basic">
							<FontAwesomeIcon icon={faUser} /> Kishan Sambhi
						</Dropdown.Toggle>

						<Dropdown.Menu variant="dark">
							<Dropdown.Item href="/api/user/logout">Log Out</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
					
				</div>
			</nav>

			<div className="sidebar">
				<h1 className="title-header">TODO</h1>

			</div>
			
			<div className="homepage-content">
				<div className="homepage-header">
					<h1 className="sub-header">Homepage</h1>
					<h3 className="header-3">Use the sidebar to the left to quickly jump to an event</h3>
				</div>
				<ButtonRow>
					<Link to="/setup">
						<ButtonWithIcons buttonType="primary">
							<ButtonIconContainer>
								<FontAwesomeIcon icon={faPlus} />
								<FontAwesomeIcon icon={faCalendarAlt} />
							</ButtonIconContainer>
							Add event
						</ButtonWithIcons>
					</Link>

					<Link to="/setup">
						<ButtonWithIcons buttonType="primary">
							<ButtonIconContainer>
								<FontAwesomeIcon icon={faPlus} />
								<FontAwesomeIcon icon={faObjectGroup} />
							</ButtonIconContainer>
							Add group
						</ButtonWithIcons>
					</Link>
				</ButtonRow>
			</div>
		</div>
	);
};

export default HomepageMain;