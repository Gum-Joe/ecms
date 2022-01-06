import { ResCompetitors, ResEventInfo } from "@ecms/api/events";
import { data_units, events_and_groups, teams } from "@ecms/models";
import React, { useEffect, useState } from "react";
import { DataEntryBase } from "./DataEntryBase";
import EntryCard from "./EntryCard";
import { EntryComponentProps } from "./interfaces";
import SaveButton from "./SaveButton";
import { fetchEventOnlyInfo, fetchJSONfromRoute, fetchTeams } from "./util";
import Form from "../common/Form";

interface TableProps {
	teamInfo: teams;
	eventId: string;
	unitInfo: data_units;
}

const CompetitorTeamTable: React.FC<TableProps> = (props) => {

	const [competitors, setcompetitors] = useState<ResCompetitors>([]);

	useEffect(() => {
		fetchJSONfromRoute<ResCompetitors>(`/api/common/${props.eventId}/competitors?team_id=${props.teamInfo.team_id}`)
			.then(data => setcompetitors(data))
			.catch((err) => {
				console.error(err);
			});
	}, [props.eventId, props.teamInfo.team_id]);

	return (
		<EntryCard className="competitor-table" style={{
			borderColor: props.teamInfo.colour,
		}}>
			<div className="competitor-table-header">
				<h3>{props.teamInfo.name}</h3>
				<h4>Tap a row to edit</h4>
			</div>
			<table className="ecms-table">
				<thead>
					<tr>
						<th>Student</th>
						<th>{props.unitInfo.unit_name}</th>
					</tr>
				</thead>
				<tbody>
					{competitors.map((competitor, index) => (
						<tr key={index}>
							<td>{competitor.firstname} {competitor.lastname}</td>
							<td>{competitor.stored_data ? competitor.stored_data + props.unitInfo.unit : "--"}</td>
						</tr>
					))}
				</tbody>
			</table>
			
		</EntryCard>
	);
};

const CompetitorEntrySlideUp: React.FC = (props) => {
	return (
		<div className="competitor-entry-slide-up">
			<div className="slide-up-cover"></div>
			<div className="slide-up-body">
				<div className="slide-up-header">
					<h3>Enter Details</h3>
					<SaveButton>Save</SaveButton>
				</div>
				<Form>
					<div className="slide-up-student">
						<p>Student</p>
						<p>Kishan Sambhi</p>
					</div>
					<div>
						<label>Distance (m)</label>
						<input name="competitor-unit" id="competitor-unit" />
					</div>
				</Form>
				<p className="slide-up-note">Type &quot;DNF&quot; if the competitor did not finish</p>
			</div>
		</div>
	);
};

const CompetitorEntry: React.FC<EntryComponentProps> = (props) => {

	// Get event info
	const [eventInfo, setEventInfo] = useState<events_and_groups>();
	const [teams, setteams] = useState<teams[]>();
	const [eventOnlyInfo, seteventOnlyInfo] = useState<ResEventInfo>();


	useEffect(() => {
		fetch(`/api/common/${props.eventId}/info`)
			.then(response => response.json())
			.then(data => setEventInfo(data))
			.catch((err) => {
				console.error(err);
			});
		
		fetchTeams(props.eventId, setteams);
		fetchEventOnlyInfo(props.eventId, seteventOnlyInfo);
		
	}, [props.eventId]);

	return (
		<DataEntryBase name="Data Entry" className={"entry-competitors"} subtitle={eventInfo?.name}>
			<EntryCard  className="entry-jump-team">
				<div>
					<h3>Jump to</h3>
					<div className="jump-buttons">
						{
							teams?.map((team, index) => <button key={index} style={{ backgroundColor: team.colour }}>{team.name}</button>)
						}
					</div>
				</div>
				{/*<div>
					<h3>Search</h3>
				</div>*/}
			</EntryCard>
			{
				eventOnlyInfo?.unit && teams?.map((team, index) => <CompetitorTeamTable key={index} teamInfo={team} eventId={props.eventId} unitInfo={eventOnlyInfo?.unit}/>)
			}

			{/** This is the thing that lets us enter details! */}
			<CompetitorEntrySlideUp />
		</DataEntryBase>
	);
};

export default CompetitorEntry;