import { faCalendar, faCog, faEdit, faHome, faTable, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Dropdown, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Button from "../common/Button";
import HomepageEventGroupID, { eventGroupIdContext } from "./context/HomepageEventGroupID";
import { HomepageBody } from "./HomepageBody";
import { Sidebar } from "./Sidebar";

/**
 * Homepage of Events Management UI
 */
const HomepageMain: React.FC = (props) => {

	const [eventGroupID, seteventGroupID] = useState<eventGroupIdContext>(undefined);

	return (
		<HomepageEventGroupID.Provider value={eventGroupID}>
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
					<Sidebar setEventGroupId={seteventGroupID}/>
				</div>
			
				<div className="homepage-content">
					<HomepageBody />
				</div>
			
			</div>
		</HomepageEventGroupID.Provider>
	);
};

export default HomepageMain;