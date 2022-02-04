import { PointsSystems } from "@ecms/api/points";
import React from "react";

const PointsSettings: React.FC<{ system?: PointsSystems }> = (props) => {
	// SWITCH CASE!
	switch (props.system) {
		default:
			return (<div>
				<p>Please select a system first.</p>
			</div>);
	}
};

export default PointsSettings;