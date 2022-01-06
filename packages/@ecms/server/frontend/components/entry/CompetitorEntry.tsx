import { ResCompetitors, ResEventInfo } from "@ecms/api/events";
import { competitorsId, competitor_data, data_units, events_and_groups, teams } from "@ecms/models";
import React, { useCallback, useContext, useEffect, useState } from "react";
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
	openSlideUp: (data: SlideUpContext) => void
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

	const handleRowClick = useCallback(
		(competitor: ResCompetitors[0]) => () => {
			props.openSlideUp({
				show: true,
				unit: props.unitInfo,
				student: competitor.firstname + " " + competitor.lastname,
				competitorId: competitor.competitor_id,
				eventId: props.eventId,
				currentData: competitor.stored_data,
			});
		},
		[props],
	);

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
							<td onClick={handleRowClick(competitor)}>{competitor.firstname} {competitor.lastname}</td>
							<td onClick={handleRowClick(competitor)}>{competitor.stored_data ? competitor.stored_data + props.unitInfo.unit : "--"}</td>
						</tr>
					))}
				</tbody>
			</table>
			
		</EntryCard>
	);
};

interface SlideUpContext {
	unit: data_units;
	student: string;
	competitorId: competitorsId;
	eventId: string;
	show: boolean;
	currentData?: competitor_data["stored_data"];
}

const EntrySlideUpContext = React.createContext<Partial<SlideUpContext>>({ show: false });

const CompetitorEntrySlideUp: React.FC = (props) => {

	const state = useContext(EntrySlideUpContext);
	const [dataValue, setdataValue] = useState(state.currentData);
	if (state.show) {
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
							<p>{state.student}</p>
						</div>
						<div>
							<label>{state.unit?.unit_name} ({state.unit?.unit})</label>
							<input name="competitor-unit" id="competitor-unit" value={dataValue || ""} placeholder="--" onChange={(event) => {event.preventDefault(); setdataValue(event.target.value);}} />
						</div>
					</Form>
					<p className="slide-up-note">Type &quot;DNF&quot; if the competitor did not finish</p>
				</div>
			</div>
		);
	} else {
		return null;
	}
	
};

const CompetitorEntry: React.FC<EntryComponentProps> = (props) => {

	// Get event info
	const [eventInfo, setEventInfo] = useState<events_and_groups>();
	const [teams, setteams] = useState<teams[]>();
	const [eventOnlyInfo, seteventOnlyInfo] = useState<ResEventInfo>();
	const [slideUp, setslideUp] = useState<Partial<SlideUpContext>>({ show: false });


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

	const openSlideUp = useCallback(
		(data: SlideUpContext) => {
			setslideUp(data);
		},
		[],
	);



	return (
		<DataEntryBase name="Data Entry" className={"entry-competitors"} subtitle={eventInfo?.name}>
			<EntrySlideUpContext.Provider value={slideUp}>
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
					eventOnlyInfo?.unit && teams?.map((team, index) => <CompetitorTeamTable key={index} teamInfo={team} eventId={props.eventId} unitInfo={eventOnlyInfo?.unit} openSlideUp={openSlideUp}/>)
				}

				{/** This is the thing that lets us enter details! */}
				<CompetitorEntrySlideUp />
			</EntrySlideUpContext.Provider>
		</DataEntryBase>
	);
};

export default CompetitorEntry;