import React, { ChangeEvent, ChangeEventHandler, useCallback } from "react";
import { Dropdown } from "@fluentui/react-northstar";
import { OrderingOptions, PointsThresholds } from "@ecms/api/points";
import AddButton from "../../common/AddButton";
import { useAppDispatch, useAppSelector } from "../../../util/hooks";
import SetupActionsList, { setupAction } from "../../../actions/setup";

const SETTINGS_OPTIONS = [
	["Lower is better", OrderingOptions.LOWER],
	["Higher is better", OrderingOptions.HIGHER]
];

/** Thresholds scoring system */
const Thresholds: React.FC = (props) => {
	const points: Partial<PointsThresholds> = (useAppSelector(state => state.setup.points?.config) || {}) as Partial<PointsThresholds> ;
	const unit = useAppSelector(state => state.setup.event_settings?.unit);
	const dispatch = useAppDispatch();

	const handleChange = useCallback((index: number, prop: keyof PointsThresholds["thresholds"][0]) => (event: ChangeEvent) => {
		event.preventDefault();
		const newConfig = Object.assign({}, points);
		if (!newConfig?.thresholds?.[index]) {
			return;
		}
		/// @ts-expect-error: TS doesn't know about the type of the value
		newConfig.thresholds[index][prop] = event.target.value;
		dispatch(setupAction(SetupActionsList.SET_POINTS_CONFIG, newConfig));

	}, [dispatch, points]);
	return (
		<div className="points-settings-container">
			<Dropdown items={SETTINGS_OPTIONS.map(option => option[0])} />
			<table className="ecms-table">
				<thead>
					<tr>
						<th>{unit?.unit_name ?? "Competitor performance"}</th>
						<th>Points</th>
						<th>Grade</th>
					</tr>
				</thead>
				<tbody>
					{points?.thresholds?.map((threshold, index) => (
						<tr key={index}>
							<td>
								<input type="number" value={threshold.result || ""} onChange={handleChange(index, "result")} />
							</td>
							<td>
								<input type="number" value={threshold.points || ""} />
							</td>
							<td>
								<input type="text" value={threshold.grade || ""} />
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<AddButton onClick={() => {
				const newConfig = Object.assign({}, points);
				/// @ts-expect-error - We want this so blank boxes are displayed
				newConfig?.thresholds?.push({});
			}}>
				Add Theshold
			</AddButton>
		</div>
	);
};

export default Thresholds;