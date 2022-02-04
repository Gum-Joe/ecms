import React from "react";
import { Dropdown } from "@fluentui/react-northstar";
import { OrderingOptions } from "@ecms/api/points";
import AddButton from "../../common/AddButton";

const SETTINGS_OPTIONS = [
	["Lower is better", OrderingOptions.LOWER],
	["Higher is better", OrderingOptions.HIGHER]
]

/** Thresholds scoring system */
const Thresholds: React.FC = (props) => {
	return (
		<div className="points-settings-container">
			<Dropdown items={SETTINGS_OPTIONS.map(option => option[0])} />
			<table className="ecms-table">
				
			</table>
			<AddButton>
				Add Theshold
			</AddButton>
		</div>
	);
};