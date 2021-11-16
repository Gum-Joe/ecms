import { baseLayerLuminance, StandardLuminance } from "@fluentui/web-components";
import React, { useEffect, useCallback, useState } from "react";
import SetupContainer from "../SetupContainer";
import SetupFrame, { SetupHeader } from "../SetupFrame";
import { useDropzone } from "react-dropzone";

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


/**
 * Handles selection of competitors
 */
const Competitors: React.FC = () => {
	useEffect(() => baseLayerLuminance.setValueFor(document.getElementById("setup-competitors") as HTMLElement, StandardLuminance.DarkMode), []);

	const [csvData, setcsvData] = useState<CSVResult>();

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
					<fluent-tab-panel key={0} id="importCsvPanel">
						{
							typeof csvData === "undefined" ?
								<div {...getRootProps({ className: "dropzone" })}>
									<input {...getInputProps()} />
									<p>Drag and drop a CSV file here, or click to browse for a CSV file</p>
									{fileRejections.length > 0 && <p className="file-reject">CSV files only</p>}
								</div>
								:
								<p>{JSON.stringify(csvData)}</p>
						}
						
					</fluent-tab-panel>
					<fluent-tab-panel key={1} id="manualEntryPanel">
						
					</fluent-tab-panel>
				</fluent-tabs>
			</SetupContainer>
		</SetupFrame>
	);
};

export default Competitors;