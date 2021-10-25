import { faCog, faEdit, faHome, faTable, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
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
				<h1 className="title-header">ECMS</h1>

			</div>
			
			<div className="homepage-content">
				<h1>CONTENT</h1>
			</div>
		</div>
	);
};

export default HomepageMain;