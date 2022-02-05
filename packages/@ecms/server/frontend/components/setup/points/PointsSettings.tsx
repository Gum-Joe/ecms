import { PointsSystems } from "@ecms/api/points";
import React from "react";
import MatchesPoints from "./Matches";
import Thresholds from "./Thresholds";

const PointsSettings: React.FC<{ system?: PointsSystems }> = (props) => {
	// SWITCH CASE!
	switch (props.system) {
		case PointsSystems.THRESHOLDS:
			return (
				<Thresholds />
			);
		case PointsSystems.MATCHES:
			return (
				<MatchesPoints />
			);
		case PointsSystems.RUNNING_TOTAL:
			return (<p>Nothing to configure.</p>);
		default:
			return (<div>
				<p>Please select a system first.</p>
			</div>);
	}
};

export default PointsSettings;