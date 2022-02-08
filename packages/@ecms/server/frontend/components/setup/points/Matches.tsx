import { PointsMatches, PointsThresholds } from "@ecms/api/points";
import React, { ChangeEvent, useCallback } from "react";
import SetupActionsList, { setupAction } from "../../../actions/setup";
import { useAppSelector, useAppDispatch } from "../../../util/hooks";
/** 
 * Points system settings for matches based scoring
 */
const MatchesPoints: React.FC = (props) => {
	const points: Partial<PointsMatches> = (useAppSelector(state => state.setup.points?.config) || {}) as Partial<PointsMatches> ;
	const dispatch = useAppDispatch();

	const handleChange = useCallback((prop: keyof PointsMatches) => (event: ChangeEvent) => {
		event.preventDefault();
		const newConfig = Object.assign({}, points);
		/// @ts-expect-error: TS doesn't know about the type of the value
		newConfig[prop] = isNaN(parseFloat(event.target.value)) ? undefined : parseFloat(event.target.value);
		dispatch(setupAction(SetupActionsList.SET_POINTS_CONFIG, newConfig));

	}, [dispatch, points]);
	
	return (
		<div className="points-settings-matches points-settings-container">
			<table className="ecms-table">
				<thead>
					<tr>
						<th>Win/Loss/Draw</th>
						<th>Points</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
								Win
						</td>
						<td>
							<input type="number" value={points.win} onChange={handleChange("win")} />
						</td>
					</tr>
					<tr>
						<td>
								Loss
						</td>
						<td>
							<input type="number" value={points.loss} onChange={handleChange("loss")} />
						</td>
					</tr>
					<tr>
						<td>
								Draw
						</td>
						<td>
							<input type="number" value={points.draw} onChange={handleChange("draw")} />
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}

export default MatchesPoints;