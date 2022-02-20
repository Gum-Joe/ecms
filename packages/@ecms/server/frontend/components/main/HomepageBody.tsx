import { PointsSystems, TeamPoints } from "@ecms/api/points";
import { events_and_groups, points_settings, store_overall_points, teams } from "@ecms/models";
import { faCalendarAlt, faObjectGroup, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Link, useParams, useRouteMatch } from "react-router-dom";
import useAsyncEffect from "use-async-effect";
import { ButtonIconContainer, ButtonRow, ButtonWithIcons } from "../common/Button";

interface PointState {
	points_settings: points_settings;
	points: (store_overall_points & teams)[];
}

/**
 * The actual body of the homepage with the event/group specific content
 */
export const HomepageBody: React.FC = (props) => {

	const { id: rawEventGroupID } = useParams<{
		id?: string | "root";
	}>();

	const eventGroupID = (!rawEventGroupID || rawEventGroupID === "root") ? undefined : rawEventGroupID;
	const { path, url } = useRouteMatch();

	const [info, setInfo] = useState<events_and_groups>();
	const [points, setpoints] = useState<PointState>();

	useAsyncEffect(async () => {
		if (eventGroupID) {
			const res = await fetch(`/api/common/${eventGroupID}/info`);
			setInfo(await res.json());

			const res2 = await fetch(`/api/common/${eventGroupID}/points`);
			setpoints(await res2.json());
		}
		
	}, [eventGroupID]);

	return (
		<>
			{!eventGroupID ?
				<div className="homepage-header">
					<h1 className="sub-header">Homepage</h1>
					<h3 className="header-3">Use the sidebar to the left to quickly jump to an event</h3>
				</div>
				:
				<div className="homepage-header">
					<h1 className="sub-header">{info?.name || "Loading"}</h1>
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

			{(eventGroupID && points?.points_settings) && <div>
				<h3>Points</h3>
				{
					(points?.points_settings && points?.points_settings?.module_id === PointsSystems.MATCHES) &&
					<table className="ecms-table">
						<thead>
							<tr>
								<th>Team</th>
								<th>Wins</th>
								<th>Draws</th>
								<th>Loss</th>
								<th>Points</th>
							</tr>
						</thead>
						<tbody>
							{
								Array.isArray(points?.points) && points?.points.map((point, index) => (
									<tr key={index}>
										<td>{point.name}</td>
										<td>{(point.data as TeamPoints).wins ?? "0"}</td>
										<td>{(point.data as TeamPoints).draws ?? "0"}</td>
										<td>{(point.data as TeamPoints).losses ?? "0"}</td>
										<td>{point.points}</td>
									</tr>
								))
							}
						</tbody>
					</table>
				}

				{
					eventGroupID && points?.points_settings && points?.points_settings?.module_id === PointsSystems.THRESHOLDS &&
					<table className="ecms-table">
						<thead>
							<tr>
								<th>Team</th>
								<th>Points</th>
							</tr>
						</thead>
						<tbody>
							{
								Array.isArray(points?.points) && points?.points.map((point, index) => (
									<tr key={index}>
										<td>{point.name}</td>
										<td>{point.points}</td>
									</tr>
								))
							}
						</tbody>
					</table>
				}
				
			</div>}

			{
				points?.points_settings?.module_id === PointsSystems.THRESHOLDS &&
				<div>
					<h3>By competitor</h3>
				</div>
			}
		</>
	);
};
