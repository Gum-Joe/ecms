import { baseLayerLuminance, StandardLuminance } from "@fluentui/web-components";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import React, { useEffect, useCallback, useState } from "react";
import SetupContainer from "../SetupContainer";
import SetupFrame, { SetupHeader } from "../SetupFrame";
import { useDropzone } from "react-dropzone";
import Button from "../../common/Button";
import ServerUpload from "./upload";
import { useAppDispatch, useAppSelector } from "../../../util/hooks";
import { CSVResult, ColumnsToGet, ColumnsToGetRecord } from "./util";
import updateSetup from "../../../actions/setup/updateSetup";
import { useHistory } from "react-router-dom";
import { handleCompetitorsRedirect } from "./handleCompetitorsRedirect";
import { useSetupRedirector } from "../util";
import FilterParentContent from "./filterParent";
import validateFilters from "../../../util/validateFilters";
import { FilterCompetitors } from "@ecms/api/setup";


/**
 * Parses a CSV
 * @param csvResult raw input of the CSV file to parse
 * @returns parsed CSV headers & data in the form of a 2D array[row][column]
 */
const parseCSV = (csvResult: string): CSVResult => {
	const csvLines = csvResult.includes("\r\n") ? csvResult.split("\r\n") : csvResult.split("\n");
	const mappedCSV = csvLines.map(line => line.split(","));
	return {
		headers: mappedCSV[0],
		data: mappedCSV.slice(1),
	};
};

// Constants to ID tabs
enum Tabs {
	CSV_IMPORT = "CSV_IMPORT",
	PARENT_INHERIT = "PARENT_INHERIT",
	MANUAL = "MANUAL",
	FILTER_PARENT = "FILTER_PARENT"
}


/** Maps columns to get to their state values */
const colunmnsToGet = new Map<ColumnsToGet | "error", string>([
	/** Index of the CSV column for names */
	["nameIndex", "competitor names"],
	/** Index of the CSV column for teams */
	["teamIndex", "team name"],
	/** Index of the CSV Column for year group */
	["yearGroupIndex", "year group in"],
	["error", "program error - no columns left to select"],
]);

/**
 * Handles selection of competitors
 */
const Competitors: React.FC = () => {
	useEffect(() => baseLayerLuminance.setValueFor(document.getElementById("setup-competitors") as HTMLElement, StandardLuminance.DarkMode), []);

	const [csvData, setcsvData] = useState<CSVResult>();
	const [csvMetaData, setcsvMetaData] = useState<ColumnsToGetRecord>({
		/** Index of the CSV column for names */
		nameIndex: -1,
		/** Index of the CSV column for teams */
		teamIndex: -1,
		/** Index of the CSV Column for year group */
		yearGroupIndex: -1,
	});
	const [activeTab, setActiveTab] = useState<Tabs>(Tabs.CSV_IMPORT);

	const teamsToMap = useAppSelector(state => state.setup.competitor_settings?.teamsMap || {});
	const parent_id = useAppSelector(state => state.setup.parent_id);
	const eventOrGroup = useAppSelector(state => state.setup.type);
	const eventType = useAppSelector(state => state.setup.event_settings?.data_tracked);

	const dispatch = useAppDispatch();
	const setupPage = useSetupRedirector();

	// Used to store key last set so we can undo it
	const [lastSetColumn, setlastSetColumn] = useState<ColumnsToGet | "error">("error");
	// From https://react-dropzone.js.org/#section-basic-example
	// Handles parsing the CSV
	const onDrop = useCallback((acceptedFiles) => {
		acceptedFiles.forEach((file: File) => {
			const reader = new FileReader();

			reader.onabort = () => console.log("file reading was aborted");
			reader.onerror = () => console.log("file reading has failed");
			reader.onload = () => {
				// Do whatever you want with the file contents - currently just read
				// Insert into state
				setcsvData(parseCSV(reader.result as string));

			};
			reader.readAsText(file);
		});

	}, []);

	// Handle next button correctly - if teams still to map, DON'T move on
	const [canGoNext, setcanGoNext] = useState(false);
	const filters = useAppSelector(state => (state.setup.competitor_settings as FilterCompetitors)?.filters);
	const onNextHandler = useCallback(() => {
		if (activeTab === Tabs.CSV_IMPORT) {
			if (!Object.values(teamsToMap as Record<any, any>).includes(-1)) {
				// All set!
				setcanGoNext(true);
			} else {
				alert("Please map all teams before continuing");
			}
		} else if (activeTab === Tabs.PARENT_INHERIT) {
			// Inheritance? Set in state and redirect!
			dispatch(updateSetup({
				competitor_settings: {
					type: "inherit",
				}
			})).then(() => {
				// Route
				handleCompetitorsRedirect(eventOrGroup, eventType, setupPage);
			});
		} else if (activeTab === Tabs.FILTER_PARENT) {
			console.log(filters);
			if (!filters || filters.length === 0) {
				alert("No filters set.");
			} else if (!validateFilters(filters)) {
				alert("Please specify all filter options.");
			} else {
				handleCompetitorsRedirect(eventOrGroup, eventType, setupPage);
			}
		}
		
	}, [teamsToMap]);

	const {
		acceptedFiles,
		fileRejections,
		getRootProps,
		getInputProps,
		isDragReject
	} = useDropzone({
		accept: ".csv",
		onDrop
	});

	return (
		<SetupFrame nextPage="/" onNext={onNextHandler}>
			<SetupHeader>
				<h1>Set Competitors</h1>
				<h3>Set competitors for this event here</h3>
			</SetupHeader>
			<SetupContainer id="setup-competitors" className="setup-competitors-container">
				<fluent-tabs activeid="import-csv">
					<fluent-tab onClick={() => setActiveTab(Tabs.CSV_IMPORT)} id="importCsv">Import from CSV</fluent-tab>
					{ parent_id && 	<fluent-tab onClick={() => setActiveTab(Tabs.PARENT_INHERIT)} id="inheritParentCompetitors">Use parent group competitors</fluent-tab> }
					{ parent_id && 	<fluent-tab onClick={() => setActiveTab(Tabs.FILTER_PARENT)} id="filterParentCompetitors">Filter from parent</fluent-tab> }
					<fluent-tab onClick={() => setActiveTab(Tabs.MANUAL)} id="manualEntry">Manual Entry</fluent-tab>
					{
						typeof csvData === "undefined" ?
							<fluent-tab-panel key={0} id="importCsvPanel">
								<div {...getRootProps({ className: "dropzone" })}>
									<input {...getInputProps()} />
									<p>Drag and drop a CSV file here, or click to browse for a CSV file</p>
									{fileRejections.length > 0 && <p className="file-reject">CSV files only</p>}
								</div>
							</fluent-tab-panel>
							:
							<fluent-tab-panel key={0} id="csvImportedTable">
								{
									// Only show this if all column are not set yet
									Object.values(csvMetaData).includes(-1) ?
										// At least one still to set
										<>
											<h4>
												Please select the column header with the <u>{colunmnsToGet.get((Object.entries(csvMetaData).find(item => item[1] === -1) || ("error" as ColumnsToGet))[0] as ColumnsToGet)}</u> in
												{lastSetColumn !== "error" && <Button
													onClick={() => {
														const newCSVMetaData = { ...csvMetaData };
														newCSVMetaData[lastSetColumn] = -1;
														setcsvMetaData(newCSVMetaData);

													}}
													buttonType="primary"
													className="competitor-undo">Undo</Button>}
											</h4>
											<TableContainer component={Paper}>
												<Table sx={{ minWidth: 1000 }} size="small" aria-label="table of imported competitors">
													<TableHead>
														<TableRow>
															{csvData.headers.map((data, dataIndex) => <TableCell
																key={dataIndex}
																align="left"
																onClick={() => {
																	// If we  find the index of this column has not been set in the csvMetadata..
																	if (!Object.entries(csvMetaData).find(item => item[1] === dataIndex)) {
																		const newMetadata = { ...csvMetaData }; // Duplicate metatdata
																		// Find the first column that has not been set (it's value is -1).
																		// Return "error" key if all column set (i.e. none has value -1)
																		const keyToSet = (Object.entries(csvMetaData).find(item => item[1] === -1) || ["error"])[0] as ColumnsToGet;
																		newMetadata[keyToSet] = dataIndex;
																		setcsvMetaData(newMetadata);
																		setlastSetColumn(keyToSet);
																	}

																} }
																disabled={Object.entries(csvMetaData).find(item => item[1] === dataIndex) ? true : false}
															>
																{data}
															</TableCell>
															)}
														</TableRow>
													</TableHead>
													<TableBody>
														{csvData.data.map((record, index) => (
															<TableRow
																key={index}
																sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
															>
																{record.map((data, dataIndex) => <TableCell key={dataIndex} component="th" scope="row">{data}</TableCell>)}
															</TableRow>
														))}
													</TableBody>
												</Table>
											</TableContainer>
										</>
										:
										// Upload to server!
										<ServerUpload csvMetaData={csvMetaData} csvData={csvData} forceUpload={canGoNext} />
								}
								
							</fluent-tab-panel>
					}	
					{parent_id && <fluent-tab-panel key={1} id="inheritCompPanel">
						<p>Please press next to proceed. Competitors from the parent group will be used.</p>
					</fluent-tab-panel>}
					{
						parent_id && <FilterParentContent key={2} id="filterParentCompPanel" />
					}
					<fluent-tab-panel key={parent_id ? 3 : 1} id="manualEntryPanel">
						
					</fluent-tab-panel>
				</fluent-tabs>
			</SetupContainer>
		</SetupFrame>
	);
};

export default Competitors;