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

interface CSVResult {
	headers: string[];
	data: string[][];
}

const parseCSV = (csvResult: string): CSVResult => {
	const csvLines = csvResult.includes("\r\n") ? csvResult.split("\r\n") : csvResult.split("\r\n");
	const mappedCSV = csvLines.map(line => line.split(","));
	return {
		headers: mappedCSV[0],
		data: mappedCSV.slice(1),
	};
};

type ColumnsToGet = "nameIndex" | "teamIndex" | "yearGroupIndex";
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
	const [csvMetaData, setcsvMetaData] = useState<Record<ColumnsToGet, number>>({
		/** Index of the CSV column for names */
		nameIndex: -1,
		/** Index of the CSV column for teams */
		teamIndex: -1,
		/** Index of the CSV Column for year group */
		yearGroupIndex: -1,
	});

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
				setcsvData(parseCSV(reader.result as string));
				// Insert into state

			};
			reader.readAsText(file);
		});

	}, []);

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
		<SetupFrame nextPage="/">
			<SetupHeader>
				<h1>Set Competitors</h1>
				<h3>Set competitors for this event here</h3>
			</SetupHeader>
			<SetupContainer id="setup-competitors" className="setup-competitors-container">
				<fluent-tabs activeid="import-csv">
					<fluent-tab id="importCsv">Import from CSV</fluent-tab>
					<fluent-tab id="manualEntry">Manual Entry</fluent-tab>
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
										<h1>Done</h1>
								}
								
							</fluent-tab-panel>
					}	
					<fluent-tab-panel key={1} id="manualEntryPanel">
						
					</fluent-tab-panel>
				</fluent-tabs>
			</SetupContainer>
		</SetupFrame>
	);
};

export default Competitors;