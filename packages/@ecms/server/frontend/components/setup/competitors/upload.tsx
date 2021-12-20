/**
 * Uploads the CSV to the server
 */
import React, { useEffect, useState } from "react";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown } from "@fluentui/react-northstar";
import { useAppDispatch, useAppSelector } from "../../../util/hooks";
import Card from "../../common/Card";
import { ColumnsToGetRecord, CSVResult } from "./util";
import SetupActions, { setupAction } from "../../../actions/setup";
import axios, { AxiosResponse } from "axios";
import { ReqUploadCompetitorsCSV } from "@ecms/api/setup";
import { useSetupRedirector } from "../util";

interface UploadProps {
	/** Metadata about columns in the CSV and how they correspond to required ECMS values */
	csvMetaData: ColumnsToGetRecord;
	/** Data to upload */
	csvData: CSVResult;
	/**
	 * Skip CSV Mapping, just upload.
	 * 
	 * Parent uses this to trigger an upload once all teams are mapped and the "Next" button is clicked.
	 */
	forceUpload?: boolean;
}

/** Used to map teams in the CSV to those created in setup */
const TeamMapper: React.FC<{ mapTeams: string[] }> = ({ mapTeams }) => {

	const teams = useAppSelector((state) => state.setup.teams);
	const dispatch = useAppDispatch();

	return (
		<div className="csv-team-mapper">
			<h2>Please map teams in the CSV to teams you created earlier below:</h2>
			<h3>You may need to go back and create any teams you can&apos;t map on the create teams page</h3>
			{
				mapTeams.map((team, index) => 
					<Card key={index}>
						<p>{team}:</p>
						<Dropdown
							items={[...(teams || []).map(team => team.name), "Create New"]}
							placeholder="Select a Team"
							required={true}
							getA11ySelectionMessage={{
								onAdd: (selectedTeam) => { dispatch(setupAction(SetupActions.CSV_MAP_TEAM, [team, index])); return `Selected ${selectedTeam}`;  }
							}}
							fluid
						/>
					</Card>
				)
			}
		</div>
	);

};

const ServerUpload: React.FC<UploadProps> = (props) => {

	// Can the redux dispatch action
	const teams = useAppSelector((state) => state.setup.teams);
	const setupID = useAppSelector((state) => state.setup.setupID) as string;
	const [teamsToMap, setTeamsToMap] = useState<string[]>([]);
	// Used to tell the renderer to procoeed to upload once scanned through
	const [canProceed, setcanProceed] = useState(false);
	const dispatch = useAppDispatch();
	const setupPage = useSetupRedirector();

	// Check for CSV teams that need to be mapped to those already created
	useEffect(() => {
		// Get list of teams in CSV
		// Since it's a Set, will be unique
		const csvTeamsList = [...new Set(props.csvData.data.map((row) => row[props.csvMetaData.teamIndex]))];
		// Filter the Set to just teams that need to be mapped to ones created by the "set teams" stage of setup
		const teamsToMap = csvTeamsList.filter((team, teamIndex) => {
			const indexOfTeam = teams?.findIndex(thisTeam => thisTeam.name === team);
			if (indexOfTeam === -1 || typeof indexOfTeam === "undefined") {
				// Need to get this team
				return team;
			}
		});
		setTeamsToMap(teamsToMap);

		// Enter -1 for all teams that have not yet been mapped
		teamsToMap.forEach(theTeam => dispatch(setupAction(SetupActions.CSV_MAP_TEAM, [theTeam, -1])));

		if (teamsToMap.length === 0) { setcanProceed(true); }
	}, [props.csvData.data, props.csvMetaData.teamIndex, teams, dispatch]);

	const uploadHandler = useEffect(() => {
		// Use to halt the request - from https://medium.datadriveninvestor.com/aborting-cancelling-requests-with-fetch-or-axios-db2e93825a36
		if (canProceed || props.forceUpload) {
			const cancelToken = axios.CancelToken;
			const source = cancelToken.source();
			const request = axios.post<unknown, AxiosResponse<unknown, any>, ReqUploadCompetitorsCSV>("/api/setup/partial/uploadCSV", {
				csvMetadata: props.csvMetaData,
				csvData: props.csvData,
				setupID: setupID,
			}, { cancelToken: source.token }).then((response) => {
				console.log(`Uploaded CSV with ${response.status}!`);
				setupPage("/end");
				// Redirect
			}).catch((error) => {
				console.error(error);
			});

			return () => {
				source.cancel("Cancelled.");
			};
		}
	}, [setupID, canProceed, props.forceUpload, props.csvMetaData, props.csvData]);
	return (
		<div className="competitor-csv-upload">
			{
				canProceed || props.forceUpload ?
					<>
						<h1>Uploading...</h1>
						<FontAwesomeIcon icon={faCircleNotch} spin={true} size={"8x"} />
					</>
					:
					<TeamMapper mapTeams={teamsToMap} />
			}
			
		</div>
	);
};

export default ServerUpload;