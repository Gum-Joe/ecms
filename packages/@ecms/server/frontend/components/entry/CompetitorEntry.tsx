import { ResEventInfo } from "@ecms/api/events";
import { data_units, events_and_groups, teams } from "@ecms/models";
import React, { useEffect, useState } from "react";
import { DataEntryBase } from "./DataEntryBase";
import EntryCard from "./EntryCard";
import { EntryComponentProps } from "./interfaces";
import { fetchEventOnlyInfo, fetchTeams } from "./util";

interface TableProps {
	teamInfo: teams;
	eventId: string;
	unitInfo: data_units;
	key: number;
}

const CompetitorTeamTable: React.FC<TableProps> = (props) => {
	return (
		<EntryCard className="competitor-table" key={props.key} style={{
			borderColor: props.teamInfo.colour,
		}}>
			<div className="competitor-table-header">
				<h3>{props.teamInfo.name}</h3>
				<h4>Tap a row to edit</h4>
			</div>
		</EntryCard>
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
				teams?.map((team, index) => <CompetitorTeamTable key={index} teamInfo={team} eventId={props.eventId} unitInfo={eventOnlyInfo?.unit}/>)
			}
			
		</DataEntryBase>
	);
};

export default CompetitorEntry;