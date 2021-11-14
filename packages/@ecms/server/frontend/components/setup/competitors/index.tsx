import { baseLayerLuminance, StandardLuminance } from "@fluentui/web-components";
import React, { useEffect, useCallback } from "react";
import SetupContainer from "../SetupContainer";
import SetupFrame, { SetupHeader } from "../SetupFrame";
import { useDropzone } from "react-dropzone";


/**
 * Handles selection of competitors
 */
const Competitors: React.FC = () => {
	useEffect(() => baseLayerLuminance.setValueFor(document.getElementById("setup-competitors") as HTMLElement, StandardLuminance.DarkMode), []);
	// From https://react-dropzone.js.org/#section-basic-example
	const onDrop = useCallback((acceptedFiles) => {
		acceptedFiles.forEach((file: File) => {
			const reader = new FileReader();

			reader.onabort = () => console.log("file reading was aborted");
			reader.onerror = () => console.log("file reading has failed");
			reader.onload = () => {
				// Do whatever you want with the file contents
				const binaryStr = reader.result;
				console.log(binaryStr);
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
						<div {...getRootProps({ className: "dropzone" })}>
							<input {...getInputProps()} />
							<p>Drag and drop a CSV file here, or click to browse for a CSV file</p>
							{fileRejections.length > 0 && <p className="file-reject">CSV files only</p>}
						</div>
					</fluent-tab-panel>
					<fluent-tab-panel key={1} id="manualEntryPanel">
						
					</fluent-tab-panel>
				</fluent-tabs>
			</SetupContainer>
		</SetupFrame>
	);
};

export default Competitors;